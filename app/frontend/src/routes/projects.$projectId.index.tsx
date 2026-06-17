import { ProjectIdIndexPage } from "@/page/ProjectIdIndexPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/")({
  component: ProjectIdIndexPage,
});
