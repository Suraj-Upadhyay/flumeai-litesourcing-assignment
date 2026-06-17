import { Badge } from "@packages/ui/components/ui/badge";
import { Link } from "@tanstack/react-router";
import {
  type IProjectStatus,
  type IProjectSummary,
} from "@/domains/project/project.types";
import { Fragment } from "react";
import { Button } from "@packages/ui/components/ui/button";

export function ProjectBreadcrumbs({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
      <Link to="/projects" className="hover:text-slate-900 transition-colors">
        Projects
      </Link>
      <span>/</span>
      <span className="text-slate-900 font-medium">
        {projectName ?? `Project ${projectId}`}
      </span>
    </div>
  );
}

interface ProjectPipelineProps {
  status: IProjectStatus;
  onStatusChange: (newStatus: IProjectStatus) => void;
}

export function ProjectPipeline({
  status,
  onStatusChange,
}: ProjectPipelineProps) {
  const stages: IProjectStatus[] = ["draft", "sourcing", "quoted", "closed"];

  return (
    <div className="flex items-center gap-3 mb-6">
      {stages.map((stage, index) => (
        <Fragment key={stage}>
          <button
            onClick={() => onStatusChange(stage)}
            className="cursor-pointer transition-opacity hover:opacity-80"
          >
            <Badge
              variant={status === stage ? "default" : "secondary"}
              className={
                status === stage
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }
            >
              {stage.charAt(0).toUpperCase() + stage.slice(1)}
            </Badge>
          </button>
          {index < stages.length - 1 && (
            <span className="text-slate-300">➔</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export function ProjectMetrics({ summary }: { summary: IProjectSummary }) {
  return (
    <div className="grid grid-cols-3 gap-6 border-t pt-6">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">
          Estimated Cost
        </p>
        <p className="text-2xl font-bold tracking-tight">
          ${summary.total_estimated_cost}
        </p>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">
          Suppliers Involved
        </p>
        <p className="text-2xl font-bold tracking-tight">
          {summary.suppliers_involved}
        </p>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">
          Longest Lead Time
        </p>
        <p className="text-2xl font-bold tracking-tight">
          {summary.longest_lead_time_days} days
        </p>
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
      <Button
        asChild
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-2 py-1 text-center"
      >
        <Link to="/projects/new">+ New Project</Link>
      </Button>
    </div>
  );
}
