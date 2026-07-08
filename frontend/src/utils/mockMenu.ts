import { MenuItem, Category } from "@/types/menu.types";

export const mockCategories: Category[] = [
  { id: "cat1", name: "Starters", restaurantId: "r1" },
  { id: "cat2", name: "Main Dishes", restaurantId: "r1" },
  { id: "cat3", name: "Desserts", restaurantId: "r1" },
  { id: "cat4", name: "Drinks", restaurantId: "r1" },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Brik à l'oeuf",
    description: "Crispy pastry filled with egg, tuna, and parsley",
    price: 6.5,
    categoryId: "cat1",
    tags: ["trending"],
  },
  {
    id: "2",
    name: "Couscous Royal",
    description: "Traditional couscous with lamb, chicken, and merguez",
    price: 18,
    categoryId: "cat2",
    tags: ["chef-recommendation"],
  },
  {
    id: "3",
    name: "Salade Mechouia",
    description: "Grilled pepper and tomato salad",
    price: 5,
    categoryId: "cat1",
    isVegetarian: true,
    isVegan: true,
    tags: ["vegetarian"],
  },
  {
    id: "4",
    name: "Makroudh",
    description: "Semolina cake filled with dates, fried and dipped in honey",
    price: 4,
    categoryId: "cat3",
    tags: [],
  },
  {
    id: "5",
    name: "Citronnade",
    description: "Fresh Tunisian lemonade with mint",
    price: 3,
    categoryId: "cat4",
    isVegetarian: true,
    isVegan: true,
    tags: ["vegetarian"],
  },
];