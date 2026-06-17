import z from "zod";

export const GetProductFilterQuerySchema = z.object({
  query: z.string().nullish().optional(),
  category_ids: z.preprocess((val) => {
    if (typeof val === "string") return val.split(",").map(Number);
    if (Array.isArray(val)) return val.map(Number);
    return val;
  }, z.array(z.number().int().positive()).optional()),

  supplier_ids: z.preprocess((val) => {
    if (typeof val === "string") return val.split(",").map(Number);
    if (Array.isArray(val)) return val.map(Number);
    return val;
  }, z.array(z.number().int().positive()).optional()),

  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export type IGetProductFilterQuery = z.infer<
  typeof GetProductFilterQuerySchema
>;

export interface IProductJoinedDb {
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
