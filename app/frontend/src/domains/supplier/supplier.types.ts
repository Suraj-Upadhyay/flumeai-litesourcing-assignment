export interface IGetSupplierFilterQuery {
  name?: string | null;
  country?: string | null;
  limit?: number;
  offset?: number;
}

export interface ISupplier {
  id: number;
  name: string;
  country: string;
  website: string | null;
}

export interface ICreateSupplierBody {
  name: string;
  country: string;
  website?: string | null;
}

export type IUpdateSupplierBody = Partial<ICreateSupplierBody>;

export interface ICreateProductBody {
  product_name: string;
  category_id: number;
  unit_price: number;
  currency: string;
  unit_of_measure_id: number;
  lead_time_days: number;
}

export type IUpdateProductBody = Partial<ICreateProductBody>;

// Since product DB type differs slightly from the joined product type above
export interface ISupplierProduct {
  id: number;
  supplier_id: number;
  product_name: string;
  category_id: number;
  unit_price: number;
  currency: string;
  unit_of_measure_id: number;
  lead_time_days: number;
  category_name?: string;
  unit_of_measure_name?: string;
}
