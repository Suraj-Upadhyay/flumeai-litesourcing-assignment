import { queryClient } from "@utility/queryClient";
import * as supplierService from "./supplier.service";
import type {
  ISupplier,
  ISupplierProduct,
  IGetSupplierFilterQuery,
  ICreateSupplierBody,
  IUpdateSupplierBody,
  ICreateProductBody,
  IUpdateProductBody,
} from "./supplier.types";

export const getSuppliersQuery = async (
  params?: IGetSupplierFilterQuery,
): Promise<ISupplier[]> => {
  return await queryClient.fetchQuery({
    queryKey: ["getSuppliers", params],
    queryFn: () => supplierService.getSuppliers(params),
    staleTime: 30_000,
  });
};

export const getSupplierByIdQuery = async (
  supplierId: number,
): Promise<ISupplier> => {
  return await queryClient.fetchQuery({
    queryKey: ["getSupplierById", supplierId],
    queryFn: () => supplierService.getSupplierById(supplierId),
    staleTime: 30_000,
  });
};

export const getSupplierProductsQuery = async (
  supplierId: number,
): Promise<ISupplierProduct[]> => {
  return await queryClient.fetchQuery({
    queryKey: ["getSupplierProducts", supplierId],
    queryFn: () => supplierService.getSupplierProducts(supplierId),
    staleTime: 30_000,
  });
};

export const createSupplierMutation = async (payload: ICreateSupplierBody) => {
  const result = await supplierService.createSupplier(payload);
  await queryClient.invalidateQueries({ queryKey: ["getSuppliers"] });
  return result;
};

export const createSupplierProductMutation = async (
  supplierId: number,
  payload: ICreateProductBody,
) => {
  const result = await supplierService.createSupplierProduct(
    supplierId,
    payload,
  );
  await queryClient.invalidateQueries({
    queryKey: ["getSupplierProducts", supplierId],
  });
  return result;
};

export const modifySupplierMutation = async (
  supplierId: number,
  payload: IUpdateSupplierBody,
) => {
  const result = await supplierService.modifySupplierById(supplierId, payload);
  await queryClient.invalidateQueries({
    predicate: (query) =>
      (query.queryKey as string[]).includes("getSupplierById") ||
      (query.queryKey as string[]).includes("getSuppliers"),
  });
  return result;
};

export const deleteSupplierMutation = async (supplierId: number) => {
  const result = await supplierService.deleteSupplierById(supplierId);
  await queryClient.invalidateQueries({ queryKey: ["getSuppliers"] });
  return result;
};

export const updateSupplierProductMutation = async (
  supplierId: number,
  productId: number,
  payload: IUpdateProductBody,
) => {
  const result = await supplierService.updateSupplierProduct(
    supplierId,
    productId,
    payload,
  );
  await queryClient.invalidateQueries({
    queryKey: ["getSupplierProducts", supplierId],
  });
  return result;
};

export const deleteSupplierProductMutation = async (
  supplierId: number,
  productId: number,
) => {
  const result = await supplierService.deleteSupplierProduct(
    supplierId,
    productId,
  );
  await queryClient.invalidateQueries({
    queryKey: ["getSupplierProducts", supplierId],
  });
  return result;
};
