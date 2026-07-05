import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ShoppingBag } from 'lucide-react';
import api from '../../api/axios';
import { formatPrice, formatDate, orderStatusColors } from '../../lib/utils';
import type { ApiResponse, OrderDto } from '../../types';

const statuses = ['Pending', 'Confirmed', 'Preparing', 'OutForDelivery', 'Delivered', 'Cancelled'];

export default function OrdersManagement() {
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(1);
  const perPage = 10;

  const { data: raw, isLoading } = useQuery({
    queryKey: ['admin-orders', pageIndex],
    queryFn: () => {
      const params = new URLSearchParams({ pageIndex: String(pageIndex), pageSize: String(perPage) });
      return api.get<ApiResponse<OrderDto[]>>(`/admin/orders?${params}`).then((r) => r.data.data);
    },
  });

  const orders = Array.isArray(raw) ? raw : [];
  const totalPages = Math.max(1, Math.ceil(orders.length / perPage));
  const hasPreviousPage = pageIndex > 1;
  const hasNextPage = pageIndex < totalPages;


  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.put(`/admin/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update status'),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30">
          <ShoppingBag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Orders</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">Manage customer orders</p>
        </div>
      </div>

      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Items</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-5 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm font-medium text-stone-900 dark:text-stone-100">#{order.id}</td>
                    <td className="px-4 py-3 text-sm text-stone-900 dark:text-stone-100">{order.customerName}</td>
                    <td className="px-4 py-3 text-sm text-stone-500 dark:text-stone-400 whitespace-nowrap">{formatDate(order.orderDate)}</td>
                    <td className="px-4 py-3 text-sm text-stone-500 dark:text-stone-400">{order.items.length}</td>
                    <td className="px-4 py-3 text-sm font-medium text-stone-900 dark:text-stone-100">{formatPrice(order.totalPrice)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                        className={`text-xs font-medium px-2 py-1.5 rounded-lg border-0 outline-none cursor-pointer ${orderStatusColors[order.status] || 'bg-stone-100 text-stone-800'}`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-500 dark:text-stone-400 max-w-[200px] truncate" title={order.shippingAddress}>
                      {order.shippingAddress}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-stone-500 dark:text-stone-400">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {orders.length > perPage && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPageIndex((p) => Math.max(1, p - 1))} disabled={!hasPreviousPage}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50 transition-colors">
            Previous
          </button>
          <span className="text-sm text-stone-500 dark:text-stone-400">
            Page {pageIndex}
          </span>
          <button onClick={() => setPageIndex((p) => p + 1)} disabled={!hasNextPage}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50 transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
