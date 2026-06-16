import z from "zod";

// --- Enums ---
export const ProjectStatusEnum = z.enum([
  "draft",
  "sourcing",
  "quoted",
  "closed",
]);
export type IProjectStatus = z.infer<typeof ProjectStatusEnum>;

// --- Queries ---
export const GetProjectFilterQuerySchema = z.object({
  project_name: z.string().nullish().optional(),
  client_name: z.string().nullish().optional(),
  status: ProjectStatusEnum.optional(),
  limit: z.coerce.number().min(1).max(100).default(10),
  offset: z.coerce.number().min(0).default(0),
});
export type IGetProjectFilterQuery = z.infer<
  typeof GetProjectFilterQuerySchema
>;

// --- Params ---
export const ProjectIdParamSchema = z.object({
  projectId: z.coerce.number().int().positive(),
});
export type IProjectIdParam = z.infer<typeof ProjectIdParamSchema>;

export const SpecItemIdParamSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  specItemId: z.coerce.number().int().positive(),
});
export type ISpecItemIdParam = z.infer<typeof SpecItemIdParamSchema>;

export const WinningOptionParamSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  specItemId: z.coerce.number().int().positive(),
  productId: z.coerce.number().int().positive(),
});
export type IWinningOptionParam = z.infer<typeof WinningOptionParamSchema>;

// --- Bodies ---
export const CreateProjectBodySchema = z.object({
  project_name: z.string().min(2).max(255),
  client_name: z.string().min(2).max(255),
});
export type ICreateProjectBody = z.infer<typeof CreateProjectBodySchema>;

export const UpdateProjectStatusBodySchema = z.object({
  project_status: ProjectStatusEnum,
});
export type IUpdateProjectStatusBody = z.infer<
  typeof UpdateProjectStatusBodySchema
>;

export const CreateSpecItemBodySchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().optional(),
  category_id: z.number().int().positive(),
  quantity: z.number().positive(),
  unit_of_measure_id: z.number().int().positive(),
});
export type ICreateSpecItemBody = z.infer<typeof CreateSpecItemBodySchema>;

export const AttachSourcingOptionBodySchema = z.object({
  product_id: z.number().int().positive(),
});
export type IAttachSourcingOptionBody = z.infer<
  typeof AttachSourcingOptionBodySchema
>;

// --- Interfaces (Database Entities) ---
export interface IProjectDb {
  id: number;
  project_name: string;
  client_name: string;
  project_status: IProjectStatus;
  created_at: Date;
  updated_at: Date | null;
}

export interface ISpecItemDb {
  id: number;
  project_id: number;
  name: string;
  description: string | null;
  category_id: number;
  quantity: string; // Numeric from PG
  unit_of_measure_id: number;
  created_at: Date;
  updated_at: Date | null;
}

export interface ISpecItemOptionDb {
  spec_item_id: number;
  product_id: number;
  is_winning: boolean;
  // Joined fields for comparison
  product_name?: string;
  unit_price?: string;
  currency?: string;
  lead_time_days?: number;
  supplier_name?: string;
}

export interface IProjectSummary {
  project_id: number;
  total_estimated_cost: string;
  suppliers_involved: number;
  longest_lead_time_days: number;
}

export const UpdateSpecItemBodySchema = CreateSpecItemBodySchema.partial();
export type IUpdateSpecItemBody = z.infer<typeof UpdateSpecItemBodySchema>;

export const DeleteSourcingOptionParamSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  specItemId: z.coerce.number().int().positive(),
  productId: z.coerce.number().int().positive(),
});
export type IDeleteSourcingOptionParam = z.infer<
  typeof DeleteSourcingOptionParamSchema
>;
