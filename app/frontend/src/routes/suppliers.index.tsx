import { SupplierIndexPage } from "@/page/SupplierIndexPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/suppliers/")({
  component: SupplierIndexPage,
});
