import { getRouteApi, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle } from "@packages/ui/components/ui/card";
import {
  SupplierBreadcrumbs,
  SupplierInfo,
} from "@/components/suppliers/Supplier";
import { supplierQueries } from "@/domains/supplier/supplier.query";

const routeApi = getRouteApi("/suppliers/$supplierId");

export const SupplierIdPage = () => {
  const { supplierId } = routeApi.useParams();
  const id = Number(supplierId);

  // Fetch the supplier data
  const { data: supplier } = useQuery(supplierQueries.detail(id));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <SupplierBreadcrumbs supplierId={supplierId} />
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {supplier?.name ?? "Loading..."}
            </CardTitle>
            {/* Pass the supplier object here */}
            {supplier && <SupplierInfo supplier={supplier} />}
          </CardHeader>
        </Card>
      </div>
      <Outlet />
    </div>
  );
};
