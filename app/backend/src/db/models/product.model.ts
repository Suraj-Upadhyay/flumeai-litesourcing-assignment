export interface IProductDb {
  id: number;
  product_name: string;
  category_id: number;
  supplier_id: number;
  unit_price: string;
  currency: string;
  unit_of_measure_id: number;
  lead_time_days: number;
}

export type InsertProduct = Omit<IProductDb, "id">;
