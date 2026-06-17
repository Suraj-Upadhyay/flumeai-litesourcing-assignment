import { ProjectIdPage } from "@/page/ProjectIdPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectIdPage,
});
