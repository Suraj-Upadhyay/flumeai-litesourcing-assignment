import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@packages/ui/components/ui/button";
import { Card, CardContent } from "@packages/ui/components/ui/card";

function SuppliersHeader() {
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

function SuppliersList() {
  return (
    <Card>
      <CardContent className="p-0 min-h-[400px] flex items-center justify-center text-slate-400">
        [TanStack Table: Supplier Directory Placeholder]
      </CardContent>
    </Card>
  );
}

export const Route = createFileRoute("/suppliers/")({
  component: () => (
    <div className="flex flex-col gap-6">
      <SuppliersHeader />
      <SuppliersList />
    </div>
  ),
});
