import z from "zod";
import type { IProductDb } from "@/db/models/product.model";
import type { ISupplierDb } from "@/db/models/suppliers.model";

// --- Queries ---
export const GetSupplierFilterQuerySchema = z.object({
  name: z.string().nullish().optional(),
  country: z.string().nullish().optional(),
  limit: z.coerce.number().min(1).max(100).default(10),
  offset: z.coerce.number().min(0).default(0),
});
export type IGetSupplierFilterQuery = z.infer<
  typeof GetSupplierFilterQuerySchema
>;

export const GetProductFilterQuerySchema = z.object({
  product_name: z.string().nullish().optional(),
  category_name: z.string().nullish().optional(),
  supplier_id: z.coerce.number().optional(),
  limit: z.coerce.number().min(1).max(100).default(10),
  offset: z.coerce.number().min(0).default(0),
});
export type IGetProductFilterQuery = z.infer<
  typeof GetProductFilterQuerySchema
>;

// --- Params ---
export const SupplierIdParamSchema = z.object({
  supplierId: z.coerce.number().int().positive(),
});
export type ISupplierIdParam = z.infer<typeof SupplierIdParamSchema>;

// --- Bodies ---
export const CreateSupplierBodySchema = z.object({
  name: z.string().min(2).max(255),
  country: z.string().min(2).max(5),
  website: z.string().url().nullish(),
});
export type ICreateSupplierBody = z.infer<typeof CreateSupplierBodySchema>;

export const UpdateSupplierBodySchema = CreateSupplierBodySchema.partial();
export type IUpdateSupplierBody = z.infer<typeof UpdateSupplierBodySchema>;

export const CreateProductBodySchema = z.object({
  product_name: z.string().min(2).max(255),
  category_id: z.number().int().positive(),
  unit_price: z.number().positive(),
  currency: z.string().length(3),
  unit_of_measure_id: z.number().int().positive(),
  lead_time_days: z.number().int().nonnegative(),
});
export type ICreateProductBody = z.infer<typeof CreateProductBodySchema>;

// --- Results ---
export type ISupplierFilterResult = ISupplierDb;
export type IProductFilterResult = IProductDb & {
  category_name?: string;
  unit_of_measure_name?: string;
};

export const ProductIdParamSchema = z.object({
  supplierId: z.coerce.number().int().positive(),
  productId: z.coerce.number().int().positive(),
});
export type IProductIdParam = z.infer<typeof ProductIdParamSchema>;

export const UpdateProductBodySchema = CreateProductBodySchema.partial();
export type IUpdateProductBody = z.infer<typeof UpdateProductBodySchema>;
