import { axiosInstance } from "@utility/api";
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
  IProjectStatus,
} from "./project.types";

export const getAllProjects = async (params?: IGetProjectFilterQuery) => {
  const response = await axiosInstance.get<IProject[]>("/project/project", {
    params,
  });
  return response.data;
};

export const createProject = async (payload: ICreateProjectBody) => {
  const response = await axiosInstance.post<IProject>(
    "/project/project",
    payload
  );
  return response.data;
};

export const getProjectById = async (projectId: number) => {
  const response = await axiosInstance.get<IProject>(
    `/project/project/${projectId}`
  );
  return response.data;
};

export const changeProjectStatus = async (
  projectId: number,
  payload: IUpdateProjectStatusBody
) => {
  const response = await axiosInstance.patch<IProject>(
    `/project/project/${projectId}/status`,
    payload
  );
  return response.data;
};

export const getProjectSummary = async (projectId: number) => {
  const response = await axiosInstance.get<IProjectSummary>(
    `/project/project/${projectId}/summary`
  );
  return response.data;
};

export const getProjectSpecItems = async (projectId: number) => {
  const response = await axiosInstance.get<ISpecItem[]>(
    `/project/project/${projectId}/spec-item`
  );
  return response.data;
};

export const createProjectSpecItem = async (
  projectId: number,
  payload: ICreateSpecItemBody
) => {
  const response = await axiosInstance.post<ISpecItem>(
    `/project/project/${projectId}/spec-item`,
    payload
  ); // 'spect-item' matching postman
  return response.data;
};

export const getSpecItemSourcingOptions = async (
  projectId: number,
  specItemId: number
) => {
  const response = await axiosInstance.get<ISpecItemOption[]>(
    `/project/project/${projectId}/spec-item/${specItemId}/option`
  );
  return response.data;
};

export const attachSourcingOption = async (
  projectId: number,
  specItemId: number,
  payload: IAttachSourcingOptionBody
) => {
  const response = await axiosInstance.post<ISpecItemOption>(
    `/project/project/${projectId}/spec-item/${specItemId}/option`,
    payload
  );
  return response.data;
};

export const setWinningOption = async (
  projectId: number,
  specItemId: number,
  productId: number
) => {
  const response = await axiosInstance.patch<null>(
    `/project/project/${projectId}/spec-item/${specItemId}/option/${productId}/win`
  );
  return response.data;
};

export const updateSpecItem = async (
  projectId: number,
  specItemId: number,
  payload: IUpdateSpecItemBody
) => {
  const response = await axiosInstance.patch<ISpecItem>(
    `/project/project/${projectId}/spec-item/${specItemId}`,
    payload
  );
  return response.data;
};

export const deleteSpecItem = async (projectId: number, specItemId: number) => {
  const response = await axiosInstance.delete<null>(
    `/project/project/${projectId}/spec-item/${specItemId}`
  );
  return response.data;
};

export const deleteSourcingOption = async (
  projectId: number,
  specItemId: number,
  productId: number
) => {
  const response = await axiosInstance.delete<null>(
    `/project/project/${projectId}/spec-item/${specItemId}/option/${productId}`
  );
  return response.data;
};

export const getProjectStatus = async (projectId: number) => {
  const response = await axiosInstance.get<{ status: IProjectStatus }>(
    `/project/project/${projectId}/status`
  );
  return response.data.status;
};
