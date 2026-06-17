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

export function CreateProjectModal() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ to: "/projects" });
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Set up a new sourcing workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 text-sm text-slate-500">
          [Project Form: Name, Client]
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClose}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
