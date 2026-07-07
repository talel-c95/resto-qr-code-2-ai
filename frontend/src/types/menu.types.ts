/**
 * Menu and category types.
 */

export interface Category {
  id: string;
  name: string;
  restaurantId: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  tags?: string[];
}
