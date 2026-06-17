export interface ICategory {
  id: number;
  name: string;
}

export interface IGetCategoryFilterQuery {
  name?: string | null;
  limit?: number;
  offset?: number;
}

export interface ICreateCategoryBody {
  name: string;
}

export interface IUpdateCategoryBody {
  name?: string;
}
