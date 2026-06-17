import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@packages/ui/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { CreateSupplierForm } from "./CreateSupplierForm"; // Adjust import path as needed

export function CreateSupplierModal() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ to: "/suppliers" });
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
          <DialogDescription>
            Register a new supplier to the directory.
          </DialogDescription>
        </DialogHeader>

        <CreateSupplierForm onSuccess={handleClose} onCancel={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
