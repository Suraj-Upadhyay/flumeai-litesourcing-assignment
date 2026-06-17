import { axiosInstance } from "@utility/api";
import type { IUom } from "./uom.types";

export const getAllUoms = async () => {
  const response = await axiosInstance.get<IUom[]>("/uom/uom");
  return response.data;
};
