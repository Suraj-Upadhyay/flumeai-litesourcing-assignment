import { getRouteApi, Outlet } from "@tanstack/react-router";
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

const routeApi = getRouteApi("/projects/$projectId");

export const ProjectIdPage = () => {
  const { projectId } = routeApi.useParams();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <ProjectBreadcrumbs projectId={projectId} />
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Project Name Placeholder</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectPipeline />
            <ProjectMetrics />
          </CardContent>
        </Card>
      </div>
      <Outlet />
    </div>
  );
};
