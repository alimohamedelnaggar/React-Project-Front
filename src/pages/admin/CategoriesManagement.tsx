import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Tags, Plus, Pencil, Trash2 } from 'lucide-react';
import { MealImage } from '../../components/MealImage';
import api from '../../api/axios';
import type {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../types';

const defaultForm: CreateCategoryDto = {
  name: '', description: '', imageUrl: '',
};

export default function CategoriesManagement() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CategoryDto | null>(null);
  const [form, setForm] = useState<CreateCategoryDto>(defaultForm);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      api.get('/admin/categories').then((r) => (r.data.data as { items: CategoryDto[] }).items),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryDto) => api.post('/admin/categories', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); toast.success('Category created'); closeForm(); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCategoryDto) => api.put('/admin/categories', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); toast.success('Category updated'); closeForm(); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/categories/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); toast.success('Category deleted'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  const openEdit = (cat: CategoryDto) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description, imageUrl: cat.imageUrl });
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <Tags className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Categories</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">Organize your menu categories</p>
          </div>
        </div>
        <button
          onClick={() => { closeForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeForm}>
          <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-stone-200 dark:border-stone-700">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {editing ? 'Edit Category' : 'New Category'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 input-focus text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm}
                  className="flex-1 px-4 py-2.5 border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 font-medium rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors">
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5 animate-pulse">
              <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded w-2/3 mb-3" />
              <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-full mb-2" />
              <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/3" />
            </div>
          ))
        ) : categories?.length ? (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <MealImage src={cat.imageUrl} alt={cat.name} className="rounded-lg" wrapperClassName="w-12 h-12 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100">{cat.name}</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2">{cat.description}</p>
                    <span className="inline-block mt-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                      {cat.mealsCount} meal{cat.mealsCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(cat)} className="p-2 text-stone-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if (confirm('Delete this category?')) deleteMutation.mutate(cat.id); }} className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-stone-500 dark:text-stone-400">
            No categories found
          </div>
        )}
      </div>
    </div>
  );
}
