import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../app/layouts/MainLayout';
import { AdminLayout } from '../app/layouts/AdminLayout';
import { ProtectedRoute } from '../guards/ProtectedRoute';
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Menu from '../pages/public/Menu';
import MealDetails from '../pages/public/MealDetails';
import NotFound from '../pages/public/NotFound';
import Cart from '../pages/customer/Cart';
import Orders from '../pages/customer/Orders';
import OrderDetails from '../pages/customer/OrderDetails';
import Dashboard from '../pages/admin/Dashboard';
import MealsManagement from '../pages/admin/MealsManagement';
import CategoriesManagement from '../pages/admin/CategoriesManagement';
import OrdersManagement from '../pages/admin/OrdersManagement';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'menu', element: <Menu /> },
      { path: 'menu/:id', element: <MealDetails /> },
      {
        path: 'cart',
        element: <ProtectedRoute />,
        children: [{ index: true, element: <Cart /> }],
      },
      {
        path: 'orders',
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Orders /> },
          { path: ':id', element: <OrderDetails /> },
        ],
      },
      {
        path: 'admin',
        element: <ProtectedRoute requireAdmin />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Dashboard /> },
              { path: 'meals', element: <MealsManagement /> },
              { path: 'categories', element: <CategoriesManagement /> },
              { path: 'orders', element: <OrdersManagement /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
