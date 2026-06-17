import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as projectService from "./project.service";
import type {
  IGetProjectFilterQuery,
  ICreateProjectBody,
  IUpdateProjectStatusBody,
  ICreateSpecItemBody,
  IUpdateSpecItemBody,
  IAttachSourcingOptionBody,
} from "./project.types";

export const projectQueries = {
  all: () => ["projects"],
  lists: () => [...projectQueries.all(), "list"],
  list: (params?: IGetProjectFilterQuery) =>
    queryOptions({
      queryKey: [...projectQueries.lists(), params],
      queryFn: () => projectService.getAllProjects(params),
      staleTime: 30_000,
    }),
  details: () => [...projectQueries.all(), "detail"],
  detail: (id: number) =>
    queryOptions({
      queryKey: [...projectQueries.details(), id],
      queryFn: () => projectService.getProjectById(id),
      staleTime: 30_000,
    }),
  summaries: () => [...projectQueries.all(), "summary"],
  summary: (id: number) =>
    queryOptions({
      queryKey: [...projectQueries.summaries(), id],
      queryFn: () => projectService.getProjectSummary(id),
      staleTime: 30_000,
    }),
  specItems: (id: number) =>
    queryOptions({
      queryKey: [...projectQueries.details(), id, "specItems"],
      queryFn: () => projectService.getProjectSpecItems(id),
      staleTime: 30_000,
    }),
  sourcingOptions: (projectId: number, specItemId: number) =>
    queryOptions({
      queryKey: [
        ...projectQueries.details(),
        projectId,
        "specItems",
        specItemId,
        "options",
      ],
      queryFn: () =>
        projectService.getSpecItemSourcingOptions(projectId, specItemId),
      staleTime: 30_000,
    }),
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateProjectBody) =>
      projectService.createProject(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectQueries.lists() }),
  });
};

export const useChangeProjectStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: number;
      payload: IUpdateProjectStatusBody;
    }) => projectService.changeProjectStatus(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueries.all() }); // Updates list & detail
    },
  });
};

export const useCreateProjectSpecItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: number;
      payload: ICreateSpecItemBody;
    }) => projectService.createProjectSpecItem(projectId, payload),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: projectQueries.specItems(projectId).queryKey,
      });
    },
  });
};

export const useAttachSourcingOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      specItemId,
      payload,
    }: {
      projectId: number;
      specItemId: number;
      payload: IAttachSourcingOptionBody;
    }) => projectService.attachSourcingOption(projectId, specItemId, payload),
    onSuccess: (_, { projectId, specItemId }) => {
      queryClient.invalidateQueries({
        queryKey: projectQueries.sourcingOptions(projectId, specItemId)
          .queryKey,
      });
    },
  });
};

export const useSetWinningOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      specItemId,
      productId,
    }: {
      projectId: number;
      specItemId: number;
      productId: number;
    }) => projectService.setWinningOption(projectId, specItemId, productId),
    onSuccess: (_, { projectId, specItemId }) => {
      queryClient.invalidateQueries({
        queryKey: projectQueries.sourcingOptions(projectId, specItemId)
          .queryKey,
      });
    },
  });
};

export const useUpdateSpecItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      specItemId,
      payload,
    }: {
      projectId: number;
      specItemId: number;
      payload: IUpdateSpecItemBody;
    }) => projectService.updateSpecItem(projectId, specItemId, payload),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: projectQueries.specItems(projectId).queryKey,
      });
    },
  });
};

export const useDeleteSpecItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      specItemId,
    }: {
      projectId: number;
      specItemId: number;
    }) => projectService.deleteSpecItem(projectId, specItemId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: projectQueries.specItems(projectId).queryKey,
      });
    },
  });
};

export const useDeleteSourcingOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      specItemId,
      productId,
    }: {
      projectId: number;
      specItemId: number;
      productId: number;
    }) => projectService.deleteSourcingOption(projectId, specItemId, productId),
    onSuccess: (_, { projectId, specItemId }) => {
      queryClient.invalidateQueries({
        queryKey: projectQueries.sourcingOptions(projectId, specItemId)
          .queryKey,
      });
    },
  });
};
