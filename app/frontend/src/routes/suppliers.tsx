import { SupplierPage } from "@/page/SupplierPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/suppliers")({
  component: SupplierPage,
});
