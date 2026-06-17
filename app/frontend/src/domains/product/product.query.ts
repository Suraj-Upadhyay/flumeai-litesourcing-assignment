import { queryOptions } from "@tanstack/react-query";
import * as productService from "./product.service";
import type { IGetProductFilterQuery } from "./product.types";

export const productQueries = {
  all: () => ["products"],
  lists: () => [...productQueries.all(), "list"],
  list: (params: IGetProductFilterQuery) =>
    queryOptions({
      queryKey: [...productQueries.lists(), params],
      queryFn: () => productService.getFilteredProducts(params),
      staleTime: 30_000,
    }),
};
