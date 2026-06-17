import { Button } from "@packages/ui/components/ui/button";
import { CardTitle } from "@packages/ui/components/ui/card";
import { Link } from "@tanstack/react-router";

export function CatalogHeader({ supplierId }: { supplierId: string }) {
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
