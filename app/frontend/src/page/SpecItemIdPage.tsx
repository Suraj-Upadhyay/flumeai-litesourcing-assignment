import {
  AttachedOptionsPane,
  GlobalCatalogPane,
} from "@/components/projects/SpecItems";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/projects/$projectId/spec-items/$specItemId");

export const SpecItemIdPage = () => {
  const { q } = routeApi.useSearch();

  return (
    <div className="flex gap-6 h-150">
      <AttachedOptionsPane />
      <GlobalCatalogPane searchQuery={q as string} />
    </div>
  );
};
