import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@packages/ui/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { CreateProductForm } from "./CreateProductForm"; // Adjust import path

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

        {/* Render the extracted form component */}
        <CreateProductForm
          supplierId={Number(supplierId)}
          onSuccess={handleClose}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
