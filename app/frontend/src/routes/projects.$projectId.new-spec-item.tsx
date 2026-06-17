import { createFileRoute } from "@tanstack/react-router";
import { ProjectIdNewSpecItemPage } from "@/page/ProejctIdNewSpecItemPage";

export const Route = createFileRoute("/projects/$projectId/new-spec-item")({
  component: ProjectIdNewSpecItemPage,
});
