import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight, Clock, CheckCircle, CookingPot, Bike, XCircle, Truck } from 'lucide-react';
import api from '../../api/axios';
import { formatPrice, formatDate, orderStatusColors } from '../../lib/utils';
import type { ApiResponse, OrderDto } from '../../types';

const statusIcons: Record<string, typeof Clock> = {
  Pending: Clock,
  Confirmed: CheckCircle,
  Preparing: CookingPot,
  OutForDelivery: Bike,
  Delivered: Truck,
  Cancelled: XCircle,
};

export default function Orders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () =>
      api.get<ApiResponse<OrderDto[]>>('/orders/my-orders').then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-stone-200 dark:bg-stone-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/30">
          <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            My Orders
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Track and manage your orders
          </p>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-24 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-stone-100 dark:bg-stone-800 mb-6">
            <Package className="w-12 h-12 text-stone-400 dark:text-stone-500" />
          </div>
          <h2 className="text-xl font-semibold text-stone-600 dark:text-stone-400 mb-2">
            No orders yet
          </h2>
          <p className="text-stone-400 dark:text-stone-500 mb-8 max-w-sm mx-auto">
            Looks like you haven't placed any orders yet. Browse our menu and place your first order!
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-xl transition-all shadow-md shadow-orange-500/20"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => {
            const StatusIcon = statusIcons[order.status] || Package;
            const statusColor = orderStatusColors[order.status] || 'bg-stone-100 text-stone-800';

            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="group block bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5 card-hover card-hover-border animate-fade-in"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-mono font-semibold text-stone-500 dark:text-stone-400">
                    #{order.id.toString().padStart(4, '0')}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${statusColor}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(order.orderDate)}
                      </span>
                      <span>
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 dark:text-stone-500 truncate max-w-xs">
                      {order.shippingAddress}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {formatPrice(order.totalPrice)}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
