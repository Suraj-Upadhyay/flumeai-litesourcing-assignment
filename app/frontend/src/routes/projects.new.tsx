import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Route as ProjectsIndexRoute } from "./projects.index";
import { Button } from "@packages/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@packages/ui/components/ui/dialog";

function CreateProjectModal() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ to: "/projects" });
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
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

export const Route = createFileRoute("/projects/new")({
  component: () => (
    <>
      <ProjectsIndexRoute.options.component />
      <CreateProjectModal />
    </>
  ),
});
