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

const ALLOWED_FLOW: Record<IProjectStatus, IProjectStatus[]> = {
  draft: ["sourcing"],
  sourcing: ["draft", "quoted"],
  quoted: ["sourcing", "closed"],
  closed: ["quoted"],
};

interface ProjectPipelineProps {
  status: IProjectStatus;
  onStatusChange: (newStatus: IProjectStatus) => void;
}

export function ProjectPipeline({
  status,
  onStatusChange,
}: ProjectPipelineProps) {
  const stages: IProjectStatus[] = ["draft", "sourcing", "quoted", "closed"];

  console.log("status: ", status);

  return (
    <div className="flex items-center gap-3 mb-6">
      {stages.map((stage, index) => {
        const isCurrent = status === stage;
        // Check if transition is allowed
        const isClickable = isCurrent || ALLOWED_FLOW[status].includes(stage);

        return (
          <Fragment key={stage}>
            <button
              disabled={!isClickable}
              onClick={() => onStatusChange(stage)}
              className={`cursor-${isClickable ? "pointer" : "not-allowed"} transition-opacity ${!isClickable && "opacity-50"}`}
            >
              <Badge
                variant={isCurrent ? "default" : "secondary"}
                className={
                  isCurrent
                    ? "bg-blue-100 text-blue-800"
                    : "bg-slate-100 text-slate-600"
                }
              >
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </Badge>
            </button>
            {index < stages.length - 1 && (
              <span className="text-slate-300">➔</span>
            )}
          </Fragment>
        );
      })}
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
