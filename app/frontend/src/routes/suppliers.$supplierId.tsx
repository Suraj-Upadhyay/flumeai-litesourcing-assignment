import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle } from "@packages/ui/components/ui/card";

function SupplierBreadcrumbs({ supplierId }: { supplierId: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
      <Link to="/suppliers" className="hover:text-slate-900 transition-colors">
        Suppliers
      </Link>
      <span>/</span>
      <span className="text-slate-900 font-medium">Supplier {supplierId}</span>
    </div>
  );
}

function SupplierInfo() {
  return (
    <div className="flex gap-4 text-sm text-slate-600 mt-2">
      <span className="flex items-center gap-1">📍 Country Name</span>
      <span className="flex items-center gap-1">🌐 website.com</span>
    </div>
  );
}

export const Route = createFileRoute("/suppliers/$supplierId")({
  component: () => {
    const { supplierId } = Route.useParams();

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
  },
});
