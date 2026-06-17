import { CatalogHeader } from "@/components/suppliers/Catalogue";
import { Card, CardContent, CardHeader } from "@packages/ui/components/ui/card";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/suppliers/$supplierId/");

export const SupplierIdIndexPage = () => {
  const { supplierId } = routeApi.useParams();
  return (
    <Card>
      <CardHeader className="pb-2">
        <CatalogHeader supplierId={supplierId} />
      </CardHeader>
      <CardContent>
        <div className="min-h-75 border rounded-md p-4 flex items-center justify-center text-slate-400 bg-slate-50/50">
          [TanStack Table: Supplier Product Catalog]
        </div>
      </CardContent>
    </Card>
  );
};
