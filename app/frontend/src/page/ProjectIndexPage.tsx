import { ProjectsList } from "@/components/projects/ProjectList";
import { ProjectsHeader } from "@/components/projects/Projects";

export const ProjectIndexPage = () => (
  <div className="flex flex-col gap-6">
    <ProjectsHeader />
    <ProjectsList />
  </div>
);
