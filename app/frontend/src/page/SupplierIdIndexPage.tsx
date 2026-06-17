import { CatalogHeader } from "@/components/suppliers/Catalogue";
import { SupplierProductsTable } from "@/components/suppliers/SupplierProductsTable";
import { Card, CardContent, CardHeader } from "@packages/ui/components/ui/card";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/suppliers/$supplierId");

export const SupplierIdIndexPage = () => {
  const { supplierId } = routeApi.useParams();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CatalogHeader supplierId={supplierId} />
      </CardHeader>
      <CardContent className="p-0">
        <SupplierProductsTable supplierId={Number(supplierId)} />
      </CardContent>
    </Card>
  );
};
