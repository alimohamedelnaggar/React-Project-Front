import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tags,
  ShoppingBag,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const sidebarLinks = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/admin/meals', label: 'Meals', icon: UtensilsCrossed },
  { path: '/admin/categories', label: 'Categories', icon: Tags },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
];

export function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-stone-800 border-r border-stone-200 dark:border-stone-700 transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 dark:border-stone-700">
          <span className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Admin Panel
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.end
              ? location.pathname === link.path
              : location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-700/50',
                )}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center gap-2 px-4 py-3 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
            Admin Panel
          </span>
        </div>
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
