import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@packages/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@packages/ui/components/ui/card";

function SpecItemsHeader({ projectId }: { projectId: string }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <CardTitle className="text-lg">Required Materials (Spec Items)</CardTitle>
      <Button size="sm" asChild>
        <Link to="/projects/$projectId/new-spec-item" params={{ projectId }}>
          + Add Spec Item
        </Link>
      </Button>
    </div>
  );
}

export const Route = createFileRoute("/projects/$projectId/")({
  component: () => {
    const { projectId } = Route.useParams();
    return (
      <Card>
        <CardHeader className="pb-2">
          <SpecItemsHeader projectId={projectId} />
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] border rounded-md p-4 flex items-center justify-center text-slate-400 bg-slate-50/50">
            [TanStack Table: Spec Items List]
          </div>
        </CardContent>
      </Card>
    );
  },
});
