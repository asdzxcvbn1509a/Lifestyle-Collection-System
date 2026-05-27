import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as categoriesApi from '@/api/categories';

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: categoriesApi.listCategories });
}

export function useCategory(id) {
  return useQuery({
    queryKey: ['categories', Number(id)],
    queryFn: () => categoriesApi.getCategory(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('เพิ่มหมวดหมู่แล้ว');
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => categoriesApi.updateCategory(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('บันทึกการแก้ไขแล้ว');
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('ลบหมวดหมู่แล้ว');
    },
    onError: (e) => toast.error(e.message),
  });
}
