import { getRouteApi, Outlet } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle } from "@packages/ui/components/ui/card";
import {
  SupplierBreadcrumbs,
  SupplierInfo,
} from "@/components/suppliers/Supplier";

const routeApi = getRouteApi("/suppliers/$supplierId");

export const SupplierIdPage = () => {
  const { supplierId } = routeApi.useParams();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <SupplierBreadcrumbs supplierId={supplierId} />
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Supplier Name Placeholder
            </CardTitle>
            <SupplierInfo />
          </CardHeader>
        </Card>
      </div>
      <Outlet />
    </div>
  );
};
