import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as supplierService from "./supplier.service";
import type {
  IGetSupplierFilterQuery,
  ICreateSupplierBody,
  IUpdateSupplierBody,
  ICreateProductBody,
  IUpdateProductBody,
} from "./supplier.types";

export const supplierQueries = {
  all: () => ["suppliers"],
  lists: () => [...supplierQueries.all(), "list"],
  list: (params?: IGetSupplierFilterQuery) =>
    queryOptions({
      queryKey: [...supplierQueries.lists(), params],
      queryFn: () => supplierService.getSuppliers(params),
      staleTime: 30_000,
    }),
  details: () => [...supplierQueries.all(), "detail"],
  detail: (id: number) =>
    queryOptions({
      queryKey: [...supplierQueries.details(), id],
      queryFn: () => supplierService.getSupplierById(id),
      staleTime: 30_000,
    }),
  products: (id: number) =>
    queryOptions({
      queryKey: [...supplierQueries.details(), id, "products"],
      queryFn: () => supplierService.getSupplierProducts(id),
      staleTime: 30_000,
    }),
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateSupplierBody) =>
      supplierService.createSupplier(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: supplierQueries.lists() }),
  });
};

export const useModifySupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      supplierId,
      payload,
    }: {
      supplierId: number;
      payload: IUpdateSupplierBody;
    }) => supplierService.modifySupplierById(supplierId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierQueries.all() });
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (supplierId: number) =>
      supplierService.deleteSupplierById(supplierId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: supplierQueries.lists() }),
  });
};

export const useCreateSupplierProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      supplierId,
      payload,
    }: {
      supplierId: number;
      payload: ICreateProductBody;
    }) => supplierService.createSupplierProduct(supplierId, payload),
    onSuccess: (_, { supplierId }) => {
      queryClient.invalidateQueries({
        queryKey: supplierQueries.products(supplierId).queryKey,
      });
    },
  });
};

export const useUpdateSupplierProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      supplierId,
      productId,
      payload,
    }: {
      supplierId: number;
      productId: number;
      payload: IUpdateProductBody;
    }) => supplierService.updateSupplierProduct(supplierId, productId, payload),
    onSuccess: (_, { supplierId }) => {
      queryClient.invalidateQueries({
        queryKey: supplierQueries.products(supplierId).queryKey,
      });
    },
  });
};

export const useDeleteSupplierProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      supplierId,
      productId,
    }: {
      supplierId: number;
      productId: number;
    }) => supplierService.deleteSupplierProduct(supplierId, productId),
    onSuccess: (_, { supplierId }) => {
      queryClient.invalidateQueries({
        queryKey: supplierQueries.products(supplierId).queryKey,
      });
    },
  });
};
