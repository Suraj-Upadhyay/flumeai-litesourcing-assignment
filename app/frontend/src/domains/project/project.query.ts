import { queryClient } from "@utility/queryClient";
import * as projectService from "./project.service";
import type {
  IProject,
  ISpecItem,
  ISpecItemOption,
  IProjectSummary,
  IGetProjectFilterQuery,
  ICreateProjectBody,
  IUpdateProjectStatusBody,
  ICreateSpecItemBody,
  IUpdateSpecItemBody,
  IAttachSourcingOptionBody,
} from "./project.types";

export const getAllProjectsQuery = async (
  params?: IGetProjectFilterQuery,
): Promise<IProject[]> => {
  return await queryClient.fetchQuery({
    queryKey: ["getAllProjects", params],
    queryFn: () => projectService.getAllProjects(params),
    staleTime: 30_000,
  });
};

export const createProjectMutation = async (payload: ICreateProjectBody) => {
  const result = await projectService.createProject(payload);
  await queryClient.invalidateQueries({ queryKey: ["getAllProjects"] });
  return result;
};

export const getProjectByIdQuery = async (
  projectId: number,
): Promise<IProject> => {
  return await queryClient.fetchQuery({
    queryKey: ["getProjectById", projectId],
    queryFn: () => projectService.getProjectById(projectId),
    staleTime: 30_000,
  });
};

export const changeProjectStatusMutation = async (
  projectId: number,
  payload: IUpdateProjectStatusBody,
) => {
  const result = await projectService.changeProjectStatus(projectId, payload);
  await queryClient.invalidateQueries({
    predicate: (query) =>
      (query.queryKey as string[]).includes("getProjectById") ||
      (query.queryKey as string[]).includes("getAllProjects"),
  });
  return result;
};

export const getProjectSummaryQuery = async (
  projectId: number,
): Promise<IProjectSummary> => {
  return await queryClient.fetchQuery({
    queryKey: ["getProjectSummary", projectId],
    queryFn: () => projectService.getProjectSummary(projectId),
    staleTime: 30_000,
  });
};

export const getProjectSpecItemsQuery = async (
  projectId: number,
): Promise<ISpecItem[]> => {
  return await queryClient.fetchQuery({
    queryKey: ["getProjectSpecItems", projectId],
    queryFn: () => projectService.getProjectSpecItems(projectId),
    staleTime: 30_000,
  });
};

export const createProjectSpecItemMutation = async (
  projectId: number,
  payload: ICreateSpecItemBody,
) => {
  const result = await projectService.createProjectSpecItem(projectId, payload);
  await queryClient.invalidateQueries({
    queryKey: ["getProjectSpecItems", projectId],
  });
  return result;
};

export const getSpecItemSourcingOptionsQuery = async (
  projectId: number,
  specItemId: number,
): Promise<ISpecItemOption[]> => {
  return await queryClient.fetchQuery({
    queryKey: ["getSpecItemSourcingOptions", projectId, specItemId],
    queryFn: () =>
      projectService.getSpecItemSourcingOptions(projectId, specItemId),
    staleTime: 30_000,
  });
};

export const attachSourcingOptionMutation = async (
  projectId: number,
  specItemId: number,
  payload: IAttachSourcingOptionBody,
) => {
  const result = await projectService.attachSourcingOption(
    projectId,
    specItemId,
    payload,
  );
  await queryClient.invalidateQueries({
    queryKey: ["getSpecItemSourcingOptions", projectId, specItemId],
  });
  return result;
};

export const setWinningOptionMutation = async (
  projectId: number,
  specItemId: number,
  productId: number,
) => {
  const result = await projectService.setWinningOption(
    projectId,
    specItemId,
    productId,
  );
  await queryClient.invalidateQueries({
    queryKey: ["getSpecItemSourcingOptions", projectId, specItemId],
  });
  return result;
};

export const updateSpecItemMutation = async (
  projectId: number,
  specItemId: number,
  payload: IUpdateSpecItemBody,
) => {
  const result = await projectService.updateSpecItem(
    projectId,
    specItemId,
    payload,
  );
  await queryClient.invalidateQueries({
    queryKey: ["getProjectSpecItems", projectId],
  });
  return result;
};

export const deleteSpecItemMutation = async (
  projectId: number,
  specItemId: number,
) => {
  const result = await projectService.deleteSpecItem(projectId, specItemId);
  await queryClient.invalidateQueries({
    queryKey: ["getProjectSpecItems", projectId],
  });
  return result;
};

export const deleteSourcingOptionMutation = async (
  projectId: number,
  specItemId: number,
  productId: number,
) => {
  const result = await projectService.deleteSourcingOption(
    projectId,
    specItemId,
    productId,
  );
  await queryClient.invalidateQueries({
    queryKey: ["getSpecItemSourcingOptions", projectId, specItemId],
  });
  return result;
};
