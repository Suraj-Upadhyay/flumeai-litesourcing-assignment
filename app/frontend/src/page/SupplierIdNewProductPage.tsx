import { CreateProductModal } from "@/components/suppliers/CreateProdcutModal";
import { SupplierIdIndexPage } from "./SupplierIdIndexPage";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/suppliers/$supplierId/new-product");

export const SupplierIdNewProductPage = () => {
  const { supplierId } = routeApi.useParams();
  return (
    <>
      <SupplierIdIndexPage />
      <CreateProductModal supplierId={supplierId} />
    </>
  );
};
