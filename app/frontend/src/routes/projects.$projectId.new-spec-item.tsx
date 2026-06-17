import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Route as ProjectIndexRoute } from "./projects.$projectId.index";
import { Button } from "@packages/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@packages/ui/components/ui/dialog";

function CreateSpecItemModal({ projectId }: { projectId: string }) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ to: "/projects/$projectId", params: { projectId } });
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Spec Item</DialogTitle>
          <DialogDescription>
            Define a material requirement for this project.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 text-sm text-slate-500">
          [Form: Name, Category, Quantity, UoM, Description]
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClose}>Add Spec Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Route = createFileRoute("/projects/$projectId/new-spec-item")({
  component: () => {
    const { projectId } = Route.useParams();
    return (
      <>
        <ProjectIndexRoute.options.component />
        <CreateSpecItemModal projectId={projectId} />
      </>
    );
  },
});
