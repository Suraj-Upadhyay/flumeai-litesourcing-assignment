import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@packages/ui/components/ui/button";
import { Card, CardContent } from "@packages/ui/components/ui/card";

function ProjectsHeader() {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Projects
        </h1>
        <p className="text-slate-500 mt-1">
          Manage all construction sourcing projects
        </p>
      </div>
      <Button asChild>
        <Link to="/projects/new">+ New Project</Link>
      </Button>
    </div>
  );
}

function ProjectsList() {
  return (
    <Card>
      <CardContent className="p-0 min-h-[400px] flex items-center justify-center text-slate-400">
        [TanStack Table: Projects List Placeholder]
      </CardContent>
    </Card>
  );
}

export const Route = createFileRoute("/projects/")({
  component: () => (
    <div className="flex flex-col gap-6">
      <ProjectsHeader />
      <ProjectsList />
    </div>
  ),
});
