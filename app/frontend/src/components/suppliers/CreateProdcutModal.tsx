import { Button } from "@packages/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@packages/ui/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";

export function CreateProductModal({ supplierId }: { supplierId: string }) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ to: "/suppliers/$supplierId", params: { supplierId } });
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
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
