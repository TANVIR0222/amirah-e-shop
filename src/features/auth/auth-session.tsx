import { createContext, useContext, useEffect, useMemo, useState } from "react"

import type { AuthData, User } from "@/features/auth/types"
import { appStorage } from "@/lib/storage/app-storage"

export type SignInInput =
  | AuthData
  | { user?: User; token?: string; access_token?: string }
  | User
  | string

type SessionContextValue = {
  user: User | null
  token: string | null
  isSignedIn: boolean
  hasHydrated: boolean
  signIn: (data: SignInInput) => void
  signOut: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)
const sessionKey = "auth-session"
const tokenKey = "auth-token"

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    Promise.all([
      appStorage.get<User | null>(sessionKey, null),
      appStorage.get<string | null>(tokenKey, null),
    ]).then(([storedUser, storedToken]) => {
      setUser(storedUser)
      setToken(storedToken)
      setHasHydrated(true)
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isSignedIn: Boolean(token),
      hasHydrated,
      signIn(data: SignInInput) {
        let nextUser: User | null = null
        let newToken: string | null = null

        if (typeof data === "string") {
          newToken = data
        } else if (typeof data === "object" && data !== null) {
          if ("access_token" in data && typeof data.access_token === "string") {
            newToken = data.access_token
          } else if ("token" in data && typeof data.token === "string") {
            newToken = data.token
          }
          if ("user" in data && data.user) {
            nextUser = data.user
          } else if ("id" in data || "email" in data) {
            nextUser = data as User
          }
        }

        setToken(newToken)
        setUser(nextUser)

        if (newToken) {
          void appStorage.set(tokenKey, newToken)
        } else {
          void appStorage.remove(tokenKey)
        }

        if (nextUser) {
          void appStorage.set(sessionKey, nextUser)
        } else {
          void appStorage.remove(sessionKey)
        }
      },
      signOut() {
        setUser(null)
        setToken(null)
        void appStorage.remove(sessionKey)
        void appStorage.remove(tokenKey)
      },
    }),
    [hasHydrated, user, token]
  )

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export function useSession() {
  const value = useContext(SessionContext)

  if (!value) {
    throw new Error("useSession must be used inside SessionProvider")
  }

  return value
}
