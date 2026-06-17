import { Button } from "@packages/ui/components/ui/button";
import { Card, CardContent } from "@packages/ui/components/ui/card";
import { Link } from "@tanstack/react-router";
import { SuppliersTable } from "./SuppliersTable";

export function SupplierBreadcrumbs({ supplierId }: { supplierId: string }) {
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

export function SupplierInfo() {
  return (
    <div className="flex gap-4 text-sm text-slate-600 mt-2">
      <span className="flex items-center gap-1">📍 Country Name</span>
      <span className="flex items-center gap-1">🌐 website.com</span>
    </div>
  );
}

export function SuppliersHeader() {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Suppliers
        </h1>
        <p className="text-slate-500 mt-1">
          Manage supplier relationships and product catalogs
        </p>
      </div>
      <Button asChild>
        <Link to="/suppliers/new">+ Add Supplier</Link>
      </Button>
    </div>
  );
}

export function SuppliersList() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 min-h-100 flex flex-col">
        <SuppliersTable />
      </CardContent>
    </Card>
  );
}
