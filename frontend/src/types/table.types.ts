export interface Table {
  id: string;
  number: number;
  restaurantId: string;
  capacity?: number;
  isActive: boolean;
}