/**
 * Cart types.
 */

export interface CartItem {
  menuItemId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}
