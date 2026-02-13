import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RootLayout } from '../app/layouts/RootLayout'
import { DashboardLayout } from '../app/layouts/DashboardLayout'
import { ProtectedRoute } from '../features/auth/ProtectedRoute'
import { AuthProvider } from '../features/auth/AuthContext'
import { HomePage } from '../pages/Home'
import { LoginPage } from '../pages/Login'
import { DashboardPage } from '../pages/Dashboard'
import { RoomsPage } from '../pages/Rooms'
import { BookingsPage } from '../pages/Bookings'
import { HistorysPage } from '../pages/Histories'
import { UsersPage } from '../pages/Users'
import { NotFoundPage } from '../pages/NotFound'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'rooms', element: <RoomsPage /> },
          { path: 'bookings', element: <BookingsPage /> },
          { path: 'histories', element: <HistorysPage /> },
          { path: 'users', element: <UsersPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

const queryClient = new QueryClient()

export function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}
