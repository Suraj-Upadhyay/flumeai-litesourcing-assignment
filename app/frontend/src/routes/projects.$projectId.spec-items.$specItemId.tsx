import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@packages/ui/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@packages/ui/components/ui/card";

type SourcingSearch = {
  q?: string;
  category?: string;
};

function AttachedOptionsPane() {
  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Attached Sourcing Options</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 border rounded-md p-4 text-slate-400 flex items-center justify-center bg-slate-50/50">
          [TanStack Table: Compare attached options. Select Winner here.]
        </div>
      </CardContent>
    </Card>
  );
}

function GlobalCatalogPane({ searchQuery }: { searchQuery: string }) {
  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Search Global Catalog</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Search products..."
          defaultValue={searchQuery}
        />
        <div className="flex-1 border rounded-md p-4 text-slate-400 flex items-center justify-center bg-slate-50/50">
          [TanStack Table: Search Results across all suppliers. Add to left
          pane.]
        </div>
      </CardContent>
    </Card>
  );
}

export const Route = createFileRoute(
  "/projects/$projectId/spec-items/$specItemId"
)({
  validateSearch: (search: Record<string, unknown>): SourcingSearch => {
    return {
      q: (search.q as string) || "",
      category: (search.category as string) || "",
    };
  },
  component: () => {
    const { q } = Route.useSearch();

    return (
      <div className="flex gap-6 h-[600px]">
        <AttachedOptionsPane />
        <GlobalCatalogPane searchQuery={q} />
      </div>
    );
  },
});
