import { SpecItemIdPage } from "@/page/SpecItemIdPage";
import { createFileRoute } from "@tanstack/react-router";

type SourcingSearch = {
  q?: string;
  category?: string;
};

export const Route = createFileRoute(
  "/projects/$projectId/spec-items/$specItemId"
)({
  validateSearch: (search: Record<string, unknown>): SourcingSearch => {
    return {
      q: (search.q as string) || "",
      category: (search.category as string) || "",
    };
  },
  component: SpecItemIdPage,
});
