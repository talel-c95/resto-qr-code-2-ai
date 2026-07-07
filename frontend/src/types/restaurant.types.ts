/**
 * Restaurant and table types.
 */

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface Table {
  id: string;
  number: number;
  restaurantId: string;
  qrCodeUrl?: string;
}
