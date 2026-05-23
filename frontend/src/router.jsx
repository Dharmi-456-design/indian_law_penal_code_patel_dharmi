import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import pages here as you build them
// import UserDashboard from './pages/dashboard/user/UserDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Welcome to LexIndia Frontend</div>,
  },
  // Add more routes based on your plan
  // {
  //   path: '/dashboard',
  //   element: <UserDashboard />,
  // },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
