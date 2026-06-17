export interface IGetProductFilterQuery {
  query?: string | null;
  category_ids?: number[];
  supplier_ids?: number[];
  limit?: number; // mandatory in Postman, defaults to 20 in schema
  offset?: number; // mandatory in Postman, defaults to 0 in schema
}

export interface IProductJoined {
  id: number;
  product_name: string;
  category_id: number;
  supplier_id: number;
  unit_price: string;
  currency: string;
  unit_of_measure_id: number;
  lead_time_days: number;
  supplier_name: string;
  category_name: string;
  unit_of_measure_name: string;
}
