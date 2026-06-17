import { axiosInstance } from "@utility/api";
import type {
  ICategory,
  IGetCategoryFilterQuery,
  ICreateCategoryBody,
  IUpdateCategoryBody,
} from "./category.types";

export const getAllCategories = async (params?: IGetCategoryFilterQuery) => {
  const response = await axiosInstance.get<ICategory[]>("/category/category", {
    params,
  });
  return response.data;
};

export const getCategoryById = async (categoryId: number) => {
  const response = await axiosInstance.get<ICategory>(
    `/category/category/${categoryId}`,
  );
  return response.data;
};

export const createCategory = async (payload: ICreateCategoryBody) => {
  const response = await axiosInstance.post<ICategory>(
    "/category/category",
    payload,
  );
  return response.data;
};

export const modifyCategoryById = async (
  categoryId: number,
  payload: IUpdateCategoryBody,
) => {
  const response = await axiosInstance.patch<ICategory>(
    `/category/category/${categoryId}`,
    payload,
  );
  return response.data;
};

export const deleteCategory = async (categoryId: number) => {
  const response = await axiosInstance.delete<null>(
    `/category/category/${categoryId}`,
  );
  return response.data;
};
