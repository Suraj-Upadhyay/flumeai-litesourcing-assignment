import { Button } from "@packages/ui/components/ui/button";
import { CardTitle } from "@packages/ui/components/ui/card";
import { Link } from "@tanstack/react-router";

export function SpecItemsHeader({ projectId }: { projectId: string }) {
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
