import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT, PRICE_MULTIPLIER } from '@constants/student';

export type CartProduct = {
  id: number;
  title: string;
  price: number; // USD gốc từ API
  image: string;
};
export type CartItem = CartProduct & { qty: number };

type CartState = {
  items: CartItem[];
  shipKm: number | null;
  shipFee: number | null;
  add: (p: CartProduct) => void;
  remove: (id: number) => void;
  changeQty: (id: number, delta: number) => void;
  setShip: (km: number, fee: number) => void;
  totalQuantity: () => number;
  totalAmount: () => number;
};

export const toVnd = (usd: number) => Math.round(usd * PRICE_MULTIPLIER);
export const formatVnd = (vnd: number) => vnd.toLocaleString('vi-VN') + ' đ';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shipKm: null,
      shipFee: null,
      add: p =>
        set(s => {
          const found = s.items.find(i => i.id === p.id);
          if (found) {
            return {
              items: s.items.map(i =>
                i.id === p.id ? { ...i, qty: i.qty + 1 } : i,
              ),
            };
          }
          return { items: [...s.items, { ...p, qty: 1 }] };
        }),
      remove: id => set(s => ({ items: s.items.filter(i => i.id !== id) })),
      changeQty: (id, delta) =>
        set(s => ({
          items: s.items
            .map(i => (i.id === id ? { ...i, qty: i.qty + delta } : i))
            .filter(i => i.qty > 0),
        })),
      setShip: (km, fee) => set({ shipKm: km, shipFee: fee }),
      totalQuantity: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalAmount: () =>
        get().items.reduce((sum, i) => sum + toVnd(i.price) * i.qty, 0),
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
