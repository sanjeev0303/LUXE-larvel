import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data } = await api.get('/products');
            return data;
        },
    });
};

export const useAdminProducts = () => {
    return useQuery({
        queryKey: ['products', 'admin'],
        queryFn: async () => {
             // Admin might have a different endpoint or included data,
             // but usually same list, just different permissions.
             // If there is an admin specific endpoint, use it.
             // Assuming basic product list is enough for now.
             const { data } = await api.get('/products');
             return data;
        },
    });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: async () => {
            const { data } = await api.get(`/products/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await api.post('/admin/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/admin/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
