import { axiosInstance } from "@utility/api";
import type {
  ISupplier,
  ISupplierProduct,
  IGetSupplierFilterQuery,
  ICreateSupplierBody,
  IUpdateSupplierBody,
  ICreateProductBody,
  IUpdateProductBody,
} from "./supplier.types";

export const getSuppliers = async (params?: IGetSupplierFilterQuery) => {
  const response = await axiosInstance.get<ISupplier[]>("/sourcing/supplier", {
    params,
  });
  return response.data;
};

export const getSupplierById = async (supplierId: number) => {
  const response = await axiosInstance.get<ISupplier>(
    `/sourcing/supplier/${supplierId}`,
  );
  return response.data;
};

export const getSupplierProducts = async (supplierId: number) => {
  const response = await axiosInstance.get<ISupplierProduct[]>(
    `/sourcing/supplier/${supplierId}/product`,
  );
  return response.data;
};

export const createSupplier = async (payload: ICreateSupplierBody) => {
  const response = await axiosInstance.post<ISupplier>(
    "/sourcing/supplier",
    payload,
  );
  return response.data;
};

export const createSupplierProduct = async (
  supplierId: number,
  payload: ICreateProductBody,
) => {
  const response = await axiosInstance.post<ISupplierProduct>(
    `/sourcing/supplier/${supplierId}/product`,
    payload,
  );
  return response.data;
};

export const modifySupplierById = async (
  supplierId: number,
  payload: IUpdateSupplierBody,
) => {
  const response = await axiosInstance.patch<ISupplier>(
    `/sourcing/supplier/${supplierId}`,
    payload,
  );
  return response.data;
};

export const deleteSupplierById = async (supplierId: number) => {
  const response = await axiosInstance.delete<null>(
    `/sourcing/supplier/${supplierId}`,
  );
  return response.data;
};

export const updateSupplierProduct = async (
  supplierId: number,
  productId: number,
  payload: IUpdateProductBody,
) => {
  const response = await axiosInstance.patch<ISupplierProduct>(
    `/sourcing/supplier/${supplierId}/product/${productId}`,
    payload,
  );
  return response.data;
};

export const deleteSupplierProduct = async (
  supplierId: number,
  productId: number,
) => {
  const response = await axiosInstance.delete<null>(
    `/sourcing/supplier/${supplierId}/product/${productId}`,
  );
  return response.data;
};
