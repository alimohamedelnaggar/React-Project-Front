import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  CookingPot,
  Bike,
  Truck,
  XCircle,
} from 'lucide-react';
import api from '../../api/axios';
import { formatPrice, formatDate, orderStatusColors } from '../../lib/utils';
import { MealImage } from '../../components/MealImage';
import type { ApiResponse, OrderDto } from '../../types';

const statusSteps = [
  { key: 'Pending', icon: Clock, label: 'Order Placed' },
  { key: 'Confirmed', icon: CheckCircle, label: 'Confirmed' },
  { key: 'Preparing', icon: CookingPot, label: 'Preparing' },
  { key: 'OutForDelivery', icon: Bike, label: 'Out for Delivery' },
  { key: 'Delivered', icon: Truck, label: 'Delivered' },
];

const statusOrder = ['Pending', 'Confirmed', 'Preparing', 'OutForDelivery', 'Delivered', 'Cancelled'];

export default function OrderDetails() {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () =>
      api.get<ApiResponse<OrderDto>>(`/orders/${id}`).then((r) => r.data.data),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-stone-200 dark:bg-stone-700 rounded" />
          <div className="h-48 bg-stone-200 dark:bg-stone-700 rounded-xl" />
          <div className="h-40 bg-stone-200 dark:bg-stone-700 rounded-xl" />
          <div className="h-32 bg-stone-200 dark:bg-stone-700 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center animate-fade-in">
        <h2 className="text-xl font-semibold text-stone-600 dark:text-stone-400 mb-4">
          Order not found
        </h2>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  const currentIdx = statusOrder.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-orange-600 dark:text-stone-400 dark:hover:text-orange-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-200 dark:border-stone-700">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    Order #{order.id.toString().padStart(4, '0')}
                  </h1>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(order.orderDate)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-full animate-scale-in ${orderStatusColors[order.status] || 'bg-stone-100 text-stone-800'}`}
                >
                  {order.status === 'OutForDelivery' ? <Bike className="w-4 h-4" /> : null}
                  {order.status === 'Preparing' ? <CookingPot className="w-4 h-4" /> : null}
                  {order.status === 'Delivered' ? <Truck className="w-4 h-4" /> : null}
                  {order.status === 'Cancelled' ? <XCircle className="w-4 h-4" /> : null}
                  {order.status}
                </span>
              </div>
            </div>

            {!isCancelled ? (
              <div className="p-6">
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-stone-200 dark:bg-stone-700" />
                  <div className="space-y-8 relative">
                    {statusSteps.map((step, idx) => {
                      const Icon = step.icon;
                      const done = idx <= currentIdx;
                      return (
                        <div key={step.key} className="flex items-start gap-4 relative">
                          <div
                            className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full shrink-0 transition-all duration-500 ${
                              done
                                ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                                : 'bg-stone-100 dark:bg-stone-700 text-stone-400 dark:text-stone-500'
                            } ${idx === currentIdx ? 'animate-bounce-in' : ''}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="pt-2.5">
                            <p
                              className={`font-semibold text-sm ${
                                done ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400 dark:text-stone-500'
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                              {idx < currentIdx ? 'Completed' : idx === currentIdx ? 'In progress' : 'Pending'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="font-semibold text-stone-900 dark:text-stone-100">Order Cancelled</p>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                  This order has been cancelled and will not be processed.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-200 dark:border-stone-700">
              <h2 className="font-semibold text-stone-900 dark:text-stone-100">
                Items ({order.items.length})
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-stone-50 dark:bg-stone-700/50 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                  >
                    <MealImage
                      src={item.mealImageUrl}
                      alt={item.mealName}
                      className="rounded-lg"
                      wrapperClassName="w-16 h-16 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-900 dark:text-stone-100">
                        {item.mealName}
                      </p>
                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                      {formatPrice(item.totalPrice)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-200 dark:border-stone-700">
              <h2 className="font-semibold text-stone-900 dark:text-stone-100">
                Order Summary
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-700">
                  <MapPin className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Shipping Address
                  </p>
                  <p className="text-sm text-stone-900 dark:text-stone-100 mt-0.5">
                    {order.shippingAddress}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500 dark:text-stone-400">Subtotal</span>
                  <span className="text-stone-900 dark:text-stone-100 font-medium">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500 dark:text-stone-400">Delivery</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-700">
                  <span className="text-base font-bold text-stone-900 dark:text-stone-100">Total</span>
                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
