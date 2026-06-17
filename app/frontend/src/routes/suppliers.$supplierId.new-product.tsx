import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Route as SupplierIndexRoute } from "./suppliers.$supplierId.index";
import { Button } from "@packages/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@packages/ui/components/ui/dialog";

function CreateProductModal({ supplierId }: { supplierId: string }) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ to: "/suppliers/$supplierId", params: { supplierId } });
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add a new product to this supplier's catalog.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 text-sm text-slate-500">
          [Form: Name, Category, Price, Currency, UoM, Lead Time]
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClose}>Save Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Route = createFileRoute("/suppliers/$supplierId/new-product")({
  component: () => {
    const { supplierId } = Route.useParams();
    return (
      <>
        <SupplierIndexRoute.options.component />
        <CreateProductModal supplierId={supplierId} />
      </>
    );
  },
});
