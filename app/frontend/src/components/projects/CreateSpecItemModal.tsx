import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@packages/ui/components/ui/dialog";
import { SpecItemForm } from "./SpecItemForm";

export const CreateSpecItemModal = ({ projectId }: { projectId: string }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ to: "/projects/$projectId", params: { projectId } });
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Add New Spec Item</DialogTitle>
          <DialogDescription>
            Define a material requirement for this project.
          </DialogDescription>
        </DialogHeader>

        {/* The form handles its own submission and action buttons */}
        <SpecItemForm
          projectId={Number(projectId)}
          onSuccess={handleClose}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};
