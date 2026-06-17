import {
  SuppliersHeader,
  SuppliersList,
} from "@/components/suppliers/Supplier";

export const SupplierIndexPage = () => (
  <div className="flex flex-col gap-6">
    <SuppliersHeader />
    <SuppliersList />
  </div>
);
