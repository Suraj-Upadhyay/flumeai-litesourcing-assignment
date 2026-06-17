import { Badge } from "@packages/ui/components/ui/badge";
import { Button } from "@packages/ui/components/ui/button";
import { Card, CardContent } from "@packages/ui/components/ui/card";
import { Link } from "@tanstack/react-router";

export function ProjectBreadcrumbs({ projectId }: { projectId: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
      <Link to="/projects" className="hover:text-slate-900 transition-colors">
        Projects
      </Link>
      <span>/</span>
      <span className="text-slate-900 font-medium">Project {projectId}</span>
    </div>
  );
}

export function ProjectPipeline() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Badge
        variant="default"
        className="bg-blue-100 text-blue-800 hover:bg-blue-100"
      >
        Draft
      </Badge>
      <span className="text-slate-300">➔</span>
      <Badge
        variant="secondary"
        className="bg-slate-100 text-slate-600 hover:bg-slate-100"
      >
        Sourcing
      </Badge>
      <span className="text-slate-300">➔</span>
      <Badge
        variant="secondary"
        className="bg-slate-100 text-slate-600 hover:bg-slate-100"
      >
        Quoted
      </Badge>
      <span className="text-slate-300">➔</span>
      <Badge
        variant="secondary"
        className="bg-slate-100 text-slate-600 hover:bg-slate-100"
      >
        Closed
      </Badge>
    </div>
  );
}

export function ProjectMetrics() {
  return (
    <div className="grid grid-cols-3 gap-6 border-t pt-6">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">
          Estimated Cost
        </p>
        <p className="text-2xl font-bold tracking-tight">$0.00</p>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">
          Suppliers Involved
        </p>
        <p className="text-2xl font-bold tracking-tight">0</p>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">
          Longest Lead Time
        </p>
        <p className="text-2xl font-bold tracking-tight">0 days</p>
      </div>
    </div>
  );
}

export function ProjectsHeader() {
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

export function ProjectsList() {
  return (
    <Card>
      <CardContent className="p-0 min-h-100 flex items-center justify-center text-slate-400">
        [TanStack Table: Projects List Placeholder]
      </CardContent>
    </Card>
  );
}
