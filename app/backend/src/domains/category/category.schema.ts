import z from "zod";

// --- Queries ---
export const GetCategoryFilterQuerySchema = z.object({
  name: z.string().nullish().optional(),
  limit: z.coerce.number().min(1).max(100).default(10),
  offset: z.coerce.number().min(0).default(0),
});
export type IGetCategoryFilterQuery = z.infer<
  typeof GetCategoryFilterQuerySchema
>;

// --- Params ---
export const CategoryIdParamSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
});
export type ICategoryIdParam = z.infer<typeof CategoryIdParamSchema>;

// --- Bodies ---
export const CreateCategoryBodySchema = z.object({
  name: z.string().min(2).max(100),
});
export type ICreateCategoryBody = z.infer<typeof CreateCategoryBodySchema>;

export const UpdateCategoryBodySchema = CreateCategoryBodySchema.partial();
export type IUpdateCategoryBody = z.infer<typeof UpdateCategoryBodySchema>;

// --- Database Entity ---
export interface ICategoryDb {
  id: number;
  name: string;
}
