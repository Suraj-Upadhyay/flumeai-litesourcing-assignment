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

const routeApi = getRouteApi("/projects/$projectId");

export const ProjectIdPage = () => {
  const { projectId } = routeApi.useParams();
  const id = Number(projectId);

  const { data: project } = useQuery(projectQueries.detail(id));
  const { data: summary } = useQuery(projectQueries.summary(id));
  const { mutate: updateStatus } = useChangeProjectStatus();

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
            {project && (
              <ProjectPipeline
                status={project.project_status}
                onStatusChange={(newStatus) =>
                  updateStatus({
                    projectId: id,
                    payload: { project_status: newStatus },
                  })
                }
              />
            )}
            {summary && <ProjectMetrics summary={summary} />}
          </CardContent>
        </Card>
      </div>
      <Outlet />
    </div>
  );
};
