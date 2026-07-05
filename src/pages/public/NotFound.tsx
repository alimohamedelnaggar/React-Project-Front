import { Link } from 'react-router-dom';
import { Home, ArrowLeft, ChefHat } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in-up">
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 shadow-lg">
            <span className="text-6xl font-extrabold text-orange-500 dark:text-orange-400">404</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-stone-800 rounded-full flex items-center justify-center shadow-md animate-bounce-in">
            <ChefHat className="w-6 h-6 text-orange-500 dark:text-orange-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          Page not found
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mb-8 leading-relaxed">
          Oops! Looks like this dish isn't on our menu. The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-xl transition-all shadow-md shadow-orange-500/20"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 font-medium rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
