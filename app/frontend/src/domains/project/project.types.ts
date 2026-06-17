export type IProjectStatus = "draft" | "sourcing" | "quoted" | "closed";

export interface IGetProjectFilterQuery {
  project_name?: string | null;
  client_name?: string | null;
  status?: IProjectStatus;
  limit?: number;
  offset?: number;
}

export interface ICreateProjectBody {
  project_name: string;
  client_name: string;
}

export interface IUpdateProjectStatusBody {
  project_status: IProjectStatus;
}

export interface ICreateSpecItemBody {
  name: string;
  description?: string;
  category_id: number;
  quantity: number;
  unit_of_measure_id: number;
}

export interface IUpdateSpecItemBody extends Partial<ICreateSpecItemBody> {}

export interface IAttachSourcingOptionBody {
  product_id: number;
}

export interface IProject {
  id: number;
  project_name: string;
  client_name: string;
  project_status: IProjectStatus;
  created_at: Date;
  updated_at: Date | null;
}

export interface ISpecItem {
  id: number;
  project_id: number;
  name: string;
  description: string | null;
  category_id: number;
  quantity: string;
  unit_of_measure_id: number;
  created_at: Date;
  updated_at: Date | null;
}

export interface ISpecItemOption {
  spec_item_id: number;
  product_id: number;
  is_winning: boolean;
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
