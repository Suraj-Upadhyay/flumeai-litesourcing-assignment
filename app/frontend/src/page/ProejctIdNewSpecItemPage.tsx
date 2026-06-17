import { getRouteApi } from "@tanstack/react-router";
import { CreateSpecItemModal } from "@/components/projects/CreateSpecItemModal";
import { ProjectIdIndexPage } from "@/page/ProjectIdIndexPage";

const routeApi = getRouteApi("/projects/$projectId/new-spec-item");

export const ProjectIdNewSpecItemPage = () => {
  const { projectId } = routeApi.useParams();

  return (
    <>
      <ProjectIdIndexPage />
      <CreateSpecItemModal projectId={projectId} />
    </>
  );
};
