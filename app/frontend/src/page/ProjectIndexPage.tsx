import { ProjectsHeader, ProjectsList } from "@/components/projects/Projects";

export const ProjectIndexPage = () => (
  <div className="flex flex-col gap-6">
    <ProjectsHeader />
    <ProjectsList />
  </div>
);
