import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
} from 'lucide-react';
import { useState } from 'react';
import api from '../../api/axios';
import { formatPrice } from '../../lib/utils';
import { MealImage } from '../../components/MealImage';
import type { ApiResponse, CartDto } from '../../types';

export default function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [address, setAddress] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () =>
      api.get<ApiResponse<CartDto>>('/cart').then((r) => r.data.data),
  });

  const updateQty = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      api.put('/cart/update', { cartItemId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  const removeItem = useMutation({
    mutationFn: (cartItemId: number) => api.delete(`/cart/remove/${cartItemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item removed');
    },
  });

  const clearCart = useMutation({
    mutationFn: () => api.delete('/cart/clear'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Cart cleared');
    },
  });

  const createOrder = useMutation({
    mutationFn: () => api.post('/orders', { shippingAddress: address }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      toast.success('Order placed successfully!');
      setShowCheckout(false);
      setAddress('');
      navigate('/orders');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Order failed'),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-stone-200 dark:bg-stone-700 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-stone-100 dark:bg-stone-800 mb-6">
          <ShoppingBag className="w-12 h-12 text-stone-400 dark:text-stone-500" />
        </div>
        <h2 className="text-2xl font-bold text-stone-600 dark:text-stone-400 mb-2">
          Your cart is empty
        </h2>
        <p className="text-stone-400 dark:text-stone-500 mb-8">
          Looks like you haven't added anything yet
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-xl transition-all shadow-md shadow-orange-500/20"
        >
          <ArrowLeft className="w-4 h-4" /> Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
            <ShoppingCart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          Your Cart
        </h1>
        <button
          onClick={() => clearCart.mutate()}
          className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 card-hover"
          >
            <Link to={`/menu/${item.mealId}`} className="shrink-0">
              <MealImage
                src={item.mealImageUrl}
                alt={item.mealName}
                className="rounded-xl"
                wrapperClassName="w-24 h-24 shrink-0"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <Link
                to={`/menu/${item.mealId}`}
                className="font-semibold text-stone-900 dark:text-stone-100 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                {item.mealName}
              </Link>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                {formatPrice(item.mealPrice)} each
              </p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center bg-stone-100 dark:bg-stone-700 rounded-lg">
                  <button
                    onClick={() =>
                      updateQty.mutate({
                        cartItemId: item.id,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                    disabled={item.quantity <= 1}
                    className="p-2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 disabled:opacity-50 rounded-lg transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-stone-900 dark:text-stone-100 min-w-[2.5rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQty.mutate({
                        cartItemId: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                    className="p-2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="font-bold text-lg text-stone-900 dark:text-stone-100">
                {formatPrice(item.totalPrice)}
              </p>
              <button
                onClick={() => removeItem.mutate(item.id)}
                className="mt-2 p-2 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 shadow-sm">
        <div className="flex items-center justify-between py-2">
          <span className="text-stone-600 dark:text-stone-400">Subtotal ({cart.itemsCount} items)</span>
          <span className="text-stone-900 dark:text-stone-100 font-medium">
            {formatPrice(cart.totalPrice)}
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-stone-600 dark:text-stone-400">Delivery</span>
          <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
        </div>
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-200 dark:border-stone-700">
          <span className="text-lg font-bold text-stone-900 dark:text-stone-100">Total</span>
          <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {formatPrice(cart.totalPrice)}
          </span>
        </div>

        {!showCheckout ? (
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md shadow-orange-500/20"
          >
            <CreditCard className="w-5 h-5" />
            Proceed to Checkout
          </button>
        ) : (
          <div className="mt-6 space-y-3">
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your shipping address..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 input-focus resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 px-4 py-3 border-2 border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 font-medium rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => createOrder.mutate()}
                disabled={!address.trim() || createOrder.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-orange-300 disabled:to-amber-300 text-white font-semibold rounded-xl transition-all shadow-md"
              >
                {createOrder.isPending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
