import { getRouteApi, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@packages/ui/components/ui/card";
import {
  ProjectBreadcrumbs,
  ProjectMetrics,
  ProjectPipeline,
} from "@/components/projects/Projects";
import {
  projectQueries,
  useChangeProjectStatus,
} from "@/domains/project/project.query";
import { useToast } from "@/components/root/toast";
import type { IProjectStatus } from "@/domains/project/project.types";

const routeApi = getRouteApi("/projects/$projectId");

export const ProjectIdPage = () => {
  const { projectId } = routeApi.useParams();
  const id = Number(projectId);
  const { toast } = useToast();

  const { data: status, isLoading } = useQuery(projectQueries.status(id));
  const { data: project } = useQuery(projectQueries.detail(id));
  const { data: summary } = useQuery(projectQueries.summary(id));
  const { mutate: updateStatus } = useChangeProjectStatus();

  const handleStatusChange = (newStatus: IProjectStatus) => {
    updateStatus(
      {
        projectId: id,
        payload: { project_status: newStatus },
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          // Display the specific error message from the backend guardrails
          toast({
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <ProjectBreadcrumbs
          projectId={projectId}
          projectName={project?.project_name}
        />
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">
              {project?.project_name ?? "Loading..."}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading status...</p>
            ) : status ? (
              <ProjectPipeline
                status={status}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <p>No status available.</p>
            )}
            {summary && <ProjectMetrics summary={summary} />}
          </CardContent>
        </Card>
      </div>
      <Outlet />
    </div>
  );
};
