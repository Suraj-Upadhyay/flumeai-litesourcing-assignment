import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@packages/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@packages/ui/components/ui/card";

function CatalogHeader({ supplierId }: { supplierId: string }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <CardTitle className="text-lg">Product Catalog</CardTitle>
      <Button size="sm" asChild>
        <Link to="/suppliers/$supplierId/new-product" params={{ supplierId }}>
          + Add Product
        </Link>
      </Button>
    </div>
  );
}

export const Route = createFileRoute("/suppliers/$supplierId/")({
  component: () => {
    const { supplierId } = Route.useParams();
    return (
      <Card>
        <CardHeader className="pb-2">
          <CatalogHeader supplierId={supplierId} />
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] border rounded-md p-4 flex items-center justify-center text-slate-400 bg-slate-50/50">
            [TanStack Table: Supplier Product Catalog]
          </div>
        </CardContent>
      </Card>
    );
  },
});
