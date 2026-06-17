import { axiosInstance } from "@utility/api";
import type { IGetProductFilterQuery, IProductJoined } from "./product.types";
import qs from "qs";

export const getFilteredProducts = async (params: IGetProductFilterQuery) => {
  const response = await axiosInstance.get<IProductJoined[]>(
    "/product/product",
    {
      params,
      paramsSerializer: (params) => {
        // This converts { supplier_ids: [11, 9] } to "supplier_ids=11,9"
        return qs.stringify(params, { arrayFormat: "comma" });
      },
    }
  );
  return response.data;
};
