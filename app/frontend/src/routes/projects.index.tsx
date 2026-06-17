import { ProjectIndexPage } from "@/page/ProjectIndexPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/")({
  component: ProjectIndexPage,
});
