import { SessionProvider } from "@/features/auth/auth-session"
import { WorkspaceProvider } from "@/features/workspace/workspace-store"
import { AppThemeProvider } from "@/theme/theme-provider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppThemeProvider>
      <SessionProvider>
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </SessionProvider>
    </AppThemeProvider>
  )
}
