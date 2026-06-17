import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as categoryService from "./category.service";
import type {
  IGetCategoryFilterQuery,
  ICreateCategoryBody,
  IUpdateCategoryBody,
} from "./category.types";

export const categoryQueries = {
  all: () => ["categories"],
  lists: () => [...categoryQueries.all(), "list"],
  list: (params?: IGetCategoryFilterQuery) =>
    queryOptions({
      queryKey: [...categoryQueries.lists(), params],
      queryFn: () => categoryService.getAllCategories(params),
      staleTime: 30_000,
    }),
  details: () => [...categoryQueries.all(), "detail"],
  detail: (id: number) =>
    queryOptions({
      queryKey: [...categoryQueries.details(), id],
      queryFn: () => categoryService.getCategoryById(id),
      staleTime: 30_000,
    }),
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateCategoryBody) =>
      categoryService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueries.lists() });
    },
  });
};

export const useModifyCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: number;
      payload: IUpdateCategoryBody;
    }) => categoryService.modifyCategoryById(categoryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueries.all() });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: number) =>
      categoryService.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueries.lists() });
    },
  });
};
