import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import UserDashboard from './pages/dashboard/user/UserDashboard';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import NotFound from './pages/public/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserDashboard />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: <UserDashboard />,
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

