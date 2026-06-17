import { ProjectPage } from "@/page/ProjectPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects")({
  component: ProjectPage,
});
