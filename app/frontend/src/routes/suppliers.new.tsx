import { createFileRoute } from "@tanstack/react-router";
import { SupplierNewPage } from "@/page/SupplierNewPage";

export const Route = createFileRoute("/suppliers/new")({
  component: SupplierNewPage,
});
