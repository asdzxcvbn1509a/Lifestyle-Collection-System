import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as itemsApi from '@/api/items';

export function useItems(params = {}) {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => itemsApi.listItems(params),
  });
}

function invalidateItemViews(qc) {
  qc.invalidateQueries({ queryKey: ['items'] });
  qc.invalidateQueries({ queryKey: ['categories'] });
  qc.invalidateQueries({ queryKey: ['stats'] });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: itemsApi.createItem,
    onSuccess: () => {
      invalidateItemViews(qc);
      toast.success('เพิ่มไอเทมแล้ว');
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => itemsApi.updateItem(id, formData),
    onSuccess: () => {
      invalidateItemViews(qc);
      toast.success('บันทึกการแก้ไขแล้ว');
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: itemsApi.deleteItem,
    onSuccess: () => {
      invalidateItemViews(qc);
      toast.success('ลบไอเทมแล้ว');
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFavorite }) => itemsApi.toggleFavorite(id, isFavorite),
    onSuccess: () => invalidateItemViews(qc),
    onError: (e) => toast.error(e.message),
  });
}
