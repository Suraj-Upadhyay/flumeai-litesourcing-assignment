import { queryClient } from "@utility/queryClient";
import * as categoryService from "./category.service";
import type {
  IGetCategoryFilterQuery,
  ICreateCategoryBody,
  IUpdateCategoryBody,
  ICategory,
} from "./category.types";

export const getAllCategoriesQuery = async (
  params?: IGetCategoryFilterQuery,
): Promise<ICategory[]> => {
  return await queryClient.fetchQuery({
    queryKey: ["getAllCategories", params],
    queryFn: () => categoryService.getAllCategories(params),
    staleTime: 30_000,
  });
};

export const getCategoryByIdQuery = async (
  categoryId: number,
): Promise<ICategory> => {
  return await queryClient.fetchQuery({
    queryKey: ["getCategoryById", categoryId],
    queryFn: () => categoryService.getCategoryById(categoryId),
    staleTime: 30_000,
  });
};

export const createCategoryMutation = async (payload: ICreateCategoryBody) => {
  const result = await categoryService.createCategory(payload);
  await queryClient.invalidateQueries({ queryKey: ["getAllCategories"] });
  return result;
};

export const modifyCategoryMutation = async (
  categoryId: number,
  payload: IUpdateCategoryBody,
) => {
  const result = await categoryService.modifyCategoryById(categoryId, payload);
  await queryClient.invalidateQueries({
    predicate: (query) => {
      const keys = query.queryKey as string[];
      return (
        keys.includes("getAllCategories") || keys.includes("getCategoryById")
      );
    },
  });
  return result;
};

export const deleteCategoryMutation = async (categoryId: number) => {
  const result = await categoryService.deleteCategory(categoryId);
  await queryClient.invalidateQueries({ queryKey: ["getAllCategories"] });
  return result;
};
