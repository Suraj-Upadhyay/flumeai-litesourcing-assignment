import { SupplierIdIndexPage } from "@/page/SupplierIdIndexPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/suppliers/$supplierId/")({
  component: SupplierIdIndexPage,
});
