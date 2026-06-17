import { SupplierIdNewProductPage } from "@/page/SupplierIdNewProductPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/suppliers/$supplierId/new-product")({
  component: SupplierIdNewProductPage,
});
