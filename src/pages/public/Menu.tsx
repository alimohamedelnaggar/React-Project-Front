import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, ShoppingCart, ChevronLeft, ChevronRight, ChefHat, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import { formatPrice, cn } from '../../lib/utils';
import { MealImage } from '../../components/MealImage';
import type { ApiResponse, PaginatedResult, MealDto, CategoryDto } from '../../types';

export default function Menu() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [addingIds, setAddingIds] = useState<Set<number>>(new Set());
  const [justAddedIds, setJustAddedIds] = useState<Set<number>>(new Set());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pageSize = 12;

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      api.get('/categories').then((r) => (r.data.data as { items: CategoryDto[] }).items),
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['meals', pageIndex, pageSize, search, categoryId],
    queryFn: () => {
      const params = new URLSearchParams({
        pageIndex: String(pageIndex),
        pageSize: String(pageSize),
      });
      if (search) params.set('search', search);
      if (categoryId) params.set('categoryId', String(categoryId));
      return api
        .get<ApiResponse<PaginatedResult<MealDto>>>(`/meals?${params}`)
        .then((r) => r.data.data);
    },
  });

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
      setPageIndex(1);
    }, 300);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPageIndex(1);
  };

  const addToCart = async (mealId: number) => {
    if (!isAuthenticated) {
      navigate(`/login?returnUrl=/menu`);
      return;
    }
    setAddingIds((prev) => new Set(prev).add(mealId));
    try {
      await api.post('/cart/add', { mealId, quantity: 1 });
      setAddingIds((prev) => { const n = new Set(prev); n.delete(mealId); return n; });
      setJustAddedIds((prev) => new Set(prev).add(mealId));
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart!');
      setTimeout(() => setJustAddedIds((prev) => { const n = new Set(prev); n.delete(mealId); return n; }), 1500);
    } catch (err: any) {
      setAddingIds((prev) => { const n = new Set(prev); n.delete(mealId); return n; });
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100 mb-3">
          Our Menu
        </h1>
        <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
          Discover our delicious selection of meals prepared with love and the finest ingredients
        </p>
      </div>

      <div className="flex flex-col gap-6 mb-8 animate-fade-in">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search meals..."
            className="w-full pl-11 pr-11 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 input-focus"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isFetching && searchInput && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin" style={{ scrollbarWidth: 'thin' }}>
          <button
            onClick={() => { setCategoryId(undefined); setPageIndex(1); }}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0',
              !categoryId
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 border border-transparent dark:border-stone-700',
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            All
          </button>
          {(Array.isArray(categories) ? categories : []).map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setCategoryId(cat.id); setPageIndex(1); }}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 border',
                categoryId === cat.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 border-transparent'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:border-orange-300 dark:bg-stone-800 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:border-orange-700 border-stone-200 dark:border-stone-700',
              )}
            >
              {cat.imageUrl ? (
                <img src={cat.imageUrl} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
              ) : (
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-200 to-amber-200 dark:from-orange-800 dark:to-amber-800 flex items-center justify-center text-xs font-bold shrink-0">
                  {cat.name.charAt(0)}
                </span>
              )}
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-600 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-full animate-pulse" />
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.items.length ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.items.map((meal, idx) => (
              <div
                key={meal.id}
                className="group bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden card-hover hover:shadow-xl card-hover-border animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <Link to={`/menu/${meal.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <MealImage
                      src={meal.imageUrl}
                      alt={meal.name}
                      className="group-hover:scale-110 transition-transform duration-700"
                      wrapperClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm text-orange-600 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {meal.categoryName}
                    </div>
                    {meal.quantity <= 5 && meal.quantity > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        Only {meal.quantity} left
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-5">
                  <Link to={`/menu/${meal.id}`}>
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {meal.name}
                    </h3>
                  </Link>
                  <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {meal.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {formatPrice(meal.price)}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(meal.id)}
                      disabled={meal.quantity === 0 || addingIds.has(meal.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200',
                        justAddedIds.has(meal.id)
                          ? 'bg-green-500 text-white shadow-md shadow-green-500/20'
                          : meal.quantity > 0
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 hover:shadow-orange-500/30'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed',
                      )}
                    >
                      {addingIds.has(meal.id) ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : justAddedIds.has(meal.id) ? (
                        <Check className="w-4 h-4 animate-scale-in" />
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )}
                      {addingIds.has(meal.id) ? 'Adding' : justAddedIds.has(meal.id) ? 'Added!' : meal.quantity === 0 ? 'Out of stock' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 animate-fade-in">
              <button
                onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                disabled={!data.hasPreviousPage}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === data.totalPages || Math.abs(p - pageIndex) <= 1)
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-2 text-stone-400">...</span>
                      )}
                      <button
                        onClick={() => setPageIndex(p)}
                        className={cn(
                          'w-10 h-10 rounded-xl text-sm font-medium transition-all',
                          p === pageIndex
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800',
                        )}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
              </div>

              <button
                onClick={() => setPageIndex((p) => p + 1)}
                disabled={!data.hasNextPage}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stone-100 dark:bg-stone-800 mb-6">
            <ChefHat className="w-10 h-10 text-stone-400 dark:text-stone-500" />
          </div>
          <h3 className="text-xl font-semibold text-stone-600 dark:text-stone-400 mb-2">
            No meals found
          </h3>
          <p className="text-stone-400 dark:text-stone-500 mb-6">
            Try adjusting your search or filter
          </p>
          <button
            onClick={() => { setSearchInput(''); setSearch(''); setCategoryId(undefined); setPageIndex(1); }}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
