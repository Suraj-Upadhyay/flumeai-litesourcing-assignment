import { SpecItemsTable } from "@/components/projects/SpecItemList";
import { SpecItemsHeader } from "@/components/projects/SpecItemsHeader";
import { Card, CardContent, CardHeader } from "@packages/ui/components/ui/card";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/projects/$projectId");

export const ProjectIdIndexPage = () => {
  const { projectId } = routeApi.useParams();

  return (
    <Card>
      <CardHeader className="pb-2">
        <SpecItemsHeader projectId={projectId} />
      </CardHeader>
      <CardContent>
        <SpecItemsTable projectId={Number(projectId)} />
      </CardContent>
    </Card>
  );
};
