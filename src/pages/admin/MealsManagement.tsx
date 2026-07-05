import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  UtensilsCrossed,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '../../api/axios';
import { formatPrice } from '../../lib/utils';
import { MealImage } from '../../components/MealImage';
import { ImageUpload } from '../../components/ImageUpload';
import type {
  ApiResponse,
  PaginatedResult,
  MealDto,
  CategoryDto,
  CreateMealDto,
  UpdateMealDto,
} from '../../types';

const defaultForm: CreateMealDto = {
  name: '', description: '', price: 0, imageUrl: '', quantity: 0, categoryId: 0,
};

export default function MealsManagement() {
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MealDto | null>(null);
  const [form, setForm] = useState<CreateMealDto>(defaultForm);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-meals', pageIndex],
    queryFn: () => {
      const params = new URLSearchParams({ pageIndex: String(pageIndex), pageSize: '10' });
      return api.get<ApiResponse<PaginatedResult<MealDto>>>(`/admin/meals?${params}`).then((r) => r.data.data);
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/admin/categories').then((r) => (r.data.data as { items: CategoryDto[] }).items),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateMealDto) => api.post('/admin/meals', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-meals'] }); toast.success('Meal created'); closeForm(); },
    onError: (err: unknown) => toast.error(getErrorMessage(err, 'Failed to create')),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateMealDto) => api.put(`/admin/meals/${data.id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-meals'] }); toast.success('Meal updated'); closeForm(); },
    onError: (err: unknown) => toast.error(getErrorMessage(err, 'Failed to update')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/meals/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-meals'] }); toast.success('Meal deleted'); },
    onError: (err: unknown) => toast.error(getErrorMessage(err, 'Failed to delete')),
  });

  function getErrorMessage(err: unknown, fallback = 'An error occurred') {
    try {
      if (typeof err === 'object' && err !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyErr = err as any;
        return anyErr.response?.data?.message ?? fallback;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      // ignore
    }
    return fallback;
  }

  const openEdit = (meal: MealDto) => {
    setEditing(meal);
    setForm({
      name: meal.name,
      description: meal.description,
      price: meal.price,
      imageUrl: meal.imageUrl,
      quantity: meal.quantity,
      categoryId: meal.categoryId,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(defaultForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ ...form, id: editing.id });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/30">
            <UtensilsCrossed className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Meals</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">Manage your menu items</p>
          </div>
        </div>
        <button
          onClick={() => { closeForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Meal
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeForm}>
          <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-stone-200 dark:border-stone-700">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {editing ? 'Edit Meal' : 'New Meal'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Price</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Quantity</label>
                  <input type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} required
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
              </div>
              <ImageUpload value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Category</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })} required
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value={0}>Select category</option>
                  {(Array.isArray(categories) ? categories : []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm}
                  className="flex-1 px-4 py-2.5 border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 font-medium rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-lg transition-colors">
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Image</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Stock</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-5 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : data?.items.length ? (
                data.items.map((meal) => (
                  <tr key={meal.id} className="hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <MealImage src={meal.imageUrl} alt={meal.name} className="rounded-lg" wrapperClassName="w-10 h-10" />
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-900 dark:text-stone-100">{meal.name}</td>
                    <td className="px-4 py-3 text-sm text-stone-500 dark:text-stone-400">{meal.categoryName}</td>
                    <td className="px-4 py-3 text-sm text-stone-900 dark:text-stone-100">{formatPrice(meal.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meal.quantity > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {meal.quantity > 0 ? `${meal.quantity} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(meal)} className="p-2 text-stone-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if (confirm('Delete this meal?')) deleteMutation.mutate(meal.id); }} className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-stone-500 dark:text-stone-400">No meals found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPageIndex((p) => Math.max(1, p - 1))} disabled={!data.hasPreviousPage}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-sm text-stone-500 dark:text-stone-400">
            Page {pageIndex} of {data.totalPages}
          </span>
          <button onClick={() => setPageIndex((p) => p + 1)} disabled={!data.hasNextPage}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50 transition-colors">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
