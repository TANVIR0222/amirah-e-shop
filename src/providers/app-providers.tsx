import store from "@/api/store/store"
import { SessionProvider } from "@/features/auth/auth-session"
import { WorkspaceProvider } from "@/features/workspace/workspace-store"
import { AppThemeProvider } from "@/theme/theme-provider"
import { Provider } from "react-redux"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppThemeProvider>
        <SessionProvider>
          <WorkspaceProvider>{children}</WorkspaceProvider>
        </SessionProvider>
      </AppThemeProvider>
    </Provider>
  )
}
