import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  ChefHat,
  Package,
  Star,
  Check,
} from 'lucide-react';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import { formatPrice } from '../../lib/utils';
import { MealImage } from '../../components/MealImage';
import type { ApiResponse, MealDto } from '../../types';

export default function MealDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const { data: meal, isLoading } = useQuery({
    queryKey: ['meal', id],
    queryFn: () =>
      api.get<ApiResponse<MealDto>>(`/meals/${id}`).then((r) => r.data.data),
    enabled: !!id,
  });

  const addToCart = useMutation({
    mutationFn: () =>
      api.post('/cart/add', { mealId: Number(id), quantity }),
    onSuccess: () => {
      setJustAdded(true);
      toast.success('Added to cart!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setTimeout(() => setJustAdded(false), 2000);
    },
    onError: (err: any) => {
      if (err.response?.status === 401) {
        navigate(`/login?returnUrl=/menu/${id}`);
      } else {
        toast.error(err.response?.data?.message || 'Failed to add to cart');
      }
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate(`/login?returnUrl=/menu/${id}`);
      return;
    }
    addToCart.mutate();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-6 w-24 bg-stone-200 dark:bg-stone-700 rounded mb-6" />
          <div className="grid md:grid-cols-2 gap-10">
            <div className="aspect-square bg-stone-200 dark:bg-stone-700 rounded-2xl" />
            <div className="space-y-5">
              <div className="h-8 w-3/4 bg-stone-200 dark:bg-stone-700 rounded" />
              <div className="h-5 w-1/4 bg-stone-200 dark:bg-stone-700 rounded" />
              <div className="h-24 bg-stone-200 dark:bg-stone-700 rounded" />
              <div className="h-14 w-1/2 bg-stone-200 dark:bg-stone-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stone-100 dark:bg-stone-800 mb-6">
          <ChefHat className="w-10 h-10 text-stone-400" />
        </div>
        <h2 className="text-2xl font-bold text-stone-600 dark:text-stone-400 mb-2">
          Meal not found
        </h2>
        <p className="text-stone-400 dark:text-stone-500 mb-6">
          The meal you're looking for doesn't exist.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link
        to="/menu"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-orange-600 dark:text-stone-400 dark:hover:text-orange-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Menu
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700 shadow-xl">
          <MealImage
            src={meal.imageUrl}
            alt={meal.name}
            wrapperClassName="w-full h-full"
          />
          {meal.quantity <= 5 && meal.quantity > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
              Only {meal.quantity} left
            </div>
          )}
          {meal.quantity === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white text-xl font-bold bg-red-500 px-6 py-3 rounded-xl shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col animate-slide-in-right">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center text-xs font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 rounded-full">
              {meal.categoryName}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 bg-stone-100 dark:bg-stone-800 dark:text-stone-400 px-3 py-1 rounded-full">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              4.9
            </span>
          </div>

          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            {meal.name}
          </h1>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-wider">
              Description
            </h3>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {meal.description}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
            <Package className="w-4 h-4" />
            {meal.quantity > 0 ? (
              <span>{meal.quantity} available</span>
            ) : (
              <span className="text-red-500 font-medium">Out of stock</span>
            )}
          </div>

          <div className="mt-auto pt-8">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                {formatPrice(meal.price)}
              </span>
            </div>

            {meal.quantity > 0 && (
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center bg-stone-100 dark:bg-stone-700 rounded-xl">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-3 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-600 disabled:opacity-50 rounded-xl transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-semibold text-stone-900 dark:text-stone-100 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(meal.quantity, q + 1))}
                    disabled={quantity >= meal.quantity}
                    className="p-3 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-600 disabled:opacity-50 rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-xl transition-all duration-200 shadow-lg
                    ${justAdded
                      ? 'bg-green-500 text-white shadow-green-500/20'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-orange-300 disabled:to-amber-300 text-white shadow-orange-500/20 hover:shadow-orange-500/30'
                    }
                  `}
                >
                  {addToCart.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : justAdded ? (
                    <>
                      <Check className="w-5 h-5 animate-scale-in" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart - {formatPrice(meal.price * quantity)}
                    </>
                  )}
                </button>
              </div>
            )}

            {!isAuthenticated && (
              <p className="mt-6 text-sm text-stone-500 dark:text-stone-400 text-center">
                <Link to="/login" className="text-orange-600 hover:text-orange-500 font-medium transition-colors">
                  Sign in
                </Link>{' '}
                to add items to your cart
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
