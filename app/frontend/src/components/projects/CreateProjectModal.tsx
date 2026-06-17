import { useCreateProject } from "@/domains/project/project.query";
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
import { ProjectForm } from "./ProjectForm";
import type { IProjectFormValues } from "@/types/project.type";

export function CreateProjectModal() {
  const navigate = useNavigate();
  const { isPending, mutate: createProject } = useCreateProject();

  const handleClose = () => {
    navigate({ to: "/projects" });
  };

  const onSubmit = (data: IProjectFormValues) => {
    createProject(data, {
      onSuccess: () => {
        handleClose();
      },
    });
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

        <ProjectForm id="create-project-form" onSubmit={onSubmit} />

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-project-form"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
