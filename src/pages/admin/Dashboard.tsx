import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Tags,
  Users,
  ShoppingBag,
  ArrowRight,
  Clock,
  Bike,
  CheckCircle,
  XCircle,
  CookingPot,
} from 'lucide-react';
import api from '../../api/axios';
import { formatPrice, formatDate, orderStatusColors } from '../../lib/utils';
import type { ApiResponse, DashboardDto, OrderDto } from '../../types';

const statusIcons: Record<string, typeof Clock> = {
  Pending: Clock, Confirmed: CheckCircle, Preparing: CookingPot,
  OutForDelivery: Bike, Delivered: CheckCircle, Cancelled: XCircle,
};

const statCards = [
  {
    label: 'Total Meals',
    key: 'totalMeals' as const,
    icon: UtensilsCrossed,
    gradient: 'from-orange-500 to-amber-500',
    link: '/admin/meals',
  },
  {
    label: 'Total Categories',
    key: 'totalCategories' as const,
    icon: Tags,
    gradient: 'from-blue-500 to-indigo-500',
    link: '/admin/categories',
  },
  {
    label: 'Total Customers',
    key: 'totalCustomers' as const,
    icon: Users,
    gradient: 'from-green-500 to-emerald-500',
    link: '/admin/orders',
  },
  {
    label: 'Total Orders',
    key: 'totalOrders' as const,
    icon: ShoppingBag,
    gradient: 'from-purple-500 to-pink-500',
    link: '/admin/orders',
  },
];

export default function Dashboard() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () =>
      api.get<ApiResponse<DashboardDto>>('/admin/dashboard').then((r) => r.data.data),
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: () =>
      api.get<ApiResponse<OrderDto[]>>('/admin/orders').then((r) => r.data.data),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Dashboard
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Overview of your restaurant
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, idx) => {
          const value = dashboard?.[card.key];
          const Icon = card.icon;
          return (
            <Link
              key={card.key}
              to={card.link}
              className="group relative bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 card-hover overflow-hidden animate-fade-in"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-5 rounded-bl-3xl group-hover:opacity-10 transition-opacity`} />
              <div className="relative">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {isLoading ? (
                  <div className="h-8 w-20 bg-stone-200 dark:bg-stone-700 rounded-lg animate-pulse mb-1" />
                ) : (
                  <p className="text-3xl font-bold text-stone-900 dark:text-stone-100">
                    {value ?? '-'}
                  </p>
                )}
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                  {card.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 animate-fade-in">
          <h2 className="font-semibold text-stone-900 dark:text-stone-100 mb-5">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              { to: '/admin/meals', icon: UtensilsCrossed, label: 'Manage Meals', desc: 'Add, edit or remove menu items', color: 'from-orange-500 to-amber-500' },
              { to: '/admin/categories', icon: Tags, label: 'Manage Categories', desc: 'Organize your menu categories', color: 'from-blue-500 to-indigo-500' },
              { to: '/admin/orders', icon: ShoppingBag, label: 'View Orders', desc: 'Manage and update order status', color: 'from-purple-500 to-pink-500' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center gap-4 px-4 py-3.5 rounded-xl bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900 dark:text-stone-100 text-sm">
                    {item.label}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {item.desc}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 animate-fade-in">
          <h2 className="font-semibold text-stone-900 dark:text-stone-100 mb-5">
            Summary
          </h2>
          {dashboard ? (
            <div className="space-y-1">
              {[
                { label: 'Total Orders', value: dashboard.totalOrders, color: 'bg-purple-500' },
                { label: 'Total Customers', value: dashboard.totalCustomers, color: 'bg-green-500' },
                { label: 'Menu Items', value: dashboard.totalMeals, color: 'bg-orange-500' },
                { label: 'Categories', value: dashboard.totalCategories, color: 'bg-blue-500' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm text-stone-600 dark:text-stone-400">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-stone-200 dark:bg-stone-700 rounded-lg" />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-stone-900 dark:text-stone-100">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-sm font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
          >
            View All
          </Link>
        </div>
        {Array.isArray(recentOrders) && recentOrders.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-700">
                  <th className="text-left py-3 px-2 font-medium text-stone-500 dark:text-stone-400">ID</th>
                  <th className="text-left py-3 px-2 font-medium text-stone-500 dark:text-stone-400">Customer</th>
                  <th className="text-left py-3 px-2 font-medium text-stone-500 dark:text-stone-400 hidden sm:table-cell">Date</th>
                  <th className="text-left py-3 px-2 font-medium text-stone-500 dark:text-stone-400">Status</th>
                  <th className="text-right py-3 px-2 font-medium text-stone-500 dark:text-stone-400">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status] || ShoppingBag;
                  return (
                    <tr key={order.id} className="border-b border-stone-100 dark:border-stone-700/50 hover:bg-stone-50 dark:hover:bg-stone-700/30 transition-colors">
                      <td className="py-3 px-2 font-mono text-stone-500">#{order.id}</td>
                      <td className="py-3 px-2 text-stone-900 dark:text-stone-100">{order.customerName || '-'}</td>
                      <td className="py-3 px-2 text-stone-500 hidden sm:table-cell">{formatDate(order.orderDate)}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${orderStatusColors[order.status] || 'bg-stone-100 text-stone-800'}`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-semibold text-stone-900 dark:text-stone-100">
                        {formatPrice(order.totalPrice)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-8">
            No orders yet
          </p>
        )}
      </div>
    </div>
  );
}
