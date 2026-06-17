import { SpecItemsHeader } from "@/components/projects/SpecItemsHeader";
import { Card, CardContent, CardHeader } from "@packages/ui/components/ui/card";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/projects/$projectId/");

export const ProjectIdIndexPage = () => {
  const { projectId } = routeApi.useParams();

  return (
    <Card>
      <CardHeader className="pb-2">
        <SpecItemsHeader projectId={projectId} />
      </CardHeader>
      <CardContent>
        <div className="min-h-75 border rounded-md p-4 flex items-center justify-center text-slate-400 bg-slate-50/50">
          [TanStack Table: Spec Items List]
        </div>
      </CardContent>
    </Card>
  );
};
