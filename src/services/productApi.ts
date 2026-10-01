import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@services/apiClient';

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
};

export async function fetchProducts(): Promise<Product[]> {
  const res = await apiClient.get<Product[]>('/products', { params: { limit: 12 } });
  return res.data;
}

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: fetchProducts });
}
