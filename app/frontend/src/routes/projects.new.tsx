import { createFileRoute } from "@tanstack/react-router";
import { ProjectNewPage } from "@/page/ProjectNewPage";

export const Route = createFileRoute("/projects/new")({
  component: ProjectNewPage,
});
