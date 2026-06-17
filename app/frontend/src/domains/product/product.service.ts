import { axiosInstance } from "@utility/api";
import type { IGetProductFilterQuery, IProductJoined } from "./product.types";

export const getFilteredProducts = async (params: IGetProductFilterQuery) => {
  const response = await axiosInstance.get<IProductJoined[]>(
    "/product/product",
    { params },
  );
  return response.data;
};
