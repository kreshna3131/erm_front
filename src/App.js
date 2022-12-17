import { QueryClient, QueryClientProvider } from "react-query"
import "./App.scss"
import useAuth from "./hooks/useAuth"
import ProtectedRoutes from "./routes/ProtectedRoutes"
import PublicRoutes from "./routes/PublicRoutes"
import { ReactQueryDevtools } from "react-query/devtools"

function App() {
  const { isAuthenticated } = useAuth()
  const queryClient = new QueryClient()

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        {isAuthenticated === null && <div>Loading ...</div>}
        {isAuthenticated === true && <ProtectedRoutes />}
        {isAuthenticated === false && <PublicRoutes />}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  )
}

export default App
