import { SpecItemIdPage } from "@/page/SpecItemIdPage";
import { createFileRoute } from "@tanstack/react-router";

type SourcingSearch = {
  q?: string;
  category_ids?: string; // These are strings in the URL (comma-separated)
  supplier_ids?: string;
};

export const Route = createFileRoute(
  "/projects/$projectId/spec-items/$specItemId"
)({
  validateSearch: (search: Record<string, unknown>): SourcingSearch => {
    return {
      q: (search.q as string) || "",
      category_ids: (search.category_ids as string) || undefined,
      supplier_ids: (search.supplier_ids as string) || undefined,
    };
  },
  component: SpecItemIdPage,
});
