import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as adminApi from '@/api/admin';

export function useUsers() {
  return useQuery({ queryKey: ['admin', 'users'], queryFn: adminApi.listUsers });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('เพิ่มผู้ใช้แล้ว');
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => adminApi.updateUser(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('อัปเดตผู้ใช้แล้ว');
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('ลบผู้ใช้แล้ว');
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useSettings() {
  return useQuery({ queryKey: ['admin', 'settings'], queryFn: adminApi.getSettings });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.updateSettings,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'settings'] });
      toast.success('บันทึกการตั้งค่าแล้ว');
    },
    onError: (e) => toast.error(e.message),
  });
}
