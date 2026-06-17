import { SupplierIdPage } from "@/page/SupplierIdPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/suppliers/$supplierId")({
  component: SupplierIdPage,
});
