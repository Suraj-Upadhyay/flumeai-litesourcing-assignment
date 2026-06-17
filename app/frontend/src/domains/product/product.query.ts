import { queryClient } from "@utility/queryClient";
import * as productService from "./product.service";
import type { IGetProductFilterQuery, IProductJoined } from "./product.types";

export const getFilteredProductsQuery = async (
  params: IGetProductFilterQuery,
): Promise<IProductJoined[]> => {
  return await queryClient.fetchQuery({
    queryKey: ["getFilteredProducts", params],
    queryFn: () => productService.getFilteredProducts(params),
    staleTime: 30_000,
  });
};
