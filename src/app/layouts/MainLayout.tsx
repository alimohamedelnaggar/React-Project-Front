import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import {
  UtensilsCrossed,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  LogIn,
  UserPlus,
  User,
  Moon,
  Sun,
  Package,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';

const navLinks = [
  { path: '/menu', label: 'Menu' },
];

export function MainLayout() {
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();
  const { dark, toggle: toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 transition-colors">
      <Toaster position="top-right" richColors closeButton />

      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-stone-900/90 backdrop-blur-lg shadow-sm'
            : 'bg-white dark:bg-stone-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-orange-600 dark:text-orange-400"
            >
              <UtensilsCrossed className="w-6 h-6" />
              <span>Foodie</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <Link
                  to="/cart"
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/cart')
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                </Link>
              )}

              {isAuthenticated && (
                <Link
                  to="/orders"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/orders')
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Orders
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800 transition-colors"
                title={dark ? 'Light mode' : 'Dark mode'}
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-stone-500 dark:text-stone-400">
                    {user?.fullName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-stone-600 hover:text-red-600 hover:bg-red-50 dark:text-stone-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800 rounded-lg transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition-colors shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 md:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800 transition-colors"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 animate-slide-down">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link
                    to="/cart"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/cart')
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" /> Cart
                  </Link>
                  <Link
                    to="/orders"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/orders')
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Package className="w-4 h-4" /> Orders
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Admin
                </Link>
              )}
              <hr className="border-stone-200 dark:border-stone-700 my-2" />
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="px-4 py-2 text-sm text-stone-500 dark:text-stone-400 flex items-center gap-2">
                    <User className="w-4 h-4" /> {user?.fullName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800 rounded-lg transition-colors"
                  >
                    <LogIn className="w-4 h-4" /> Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition-colors"
                  >
                    <UserPlus className="w-4 h-4" /> Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-orange-600 dark:text-orange-400">
              <UtensilsCrossed className="w-5 h-5" />
              <span>Foodie</span>
            </Link>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              &copy; {new Date().getFullYear()} Foodie. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
