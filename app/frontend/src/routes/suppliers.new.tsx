import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Route as SuppliersIndexRoute } from "./suppliers.index";
import { Button } from "@packages/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@packages/ui/components/ui/dialog";

function CreateSupplierModal() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ to: "/suppliers" });
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
          <DialogDescription>
            Register a new supplier to the directory.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 text-sm text-slate-500">
          [Form: Name, Country, Website]
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClose}>Save Supplier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Route = createFileRoute("/suppliers/new")({
  component: () => (
    <>
      <SuppliersIndexRoute.options.component />
      <CreateSupplierModal />
    </>
  ),
});
