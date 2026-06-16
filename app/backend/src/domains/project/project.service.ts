import { AbstractClass, Primary } from "@/di/injector";
import { ProjectRepositoryInterface } from "./project.repository";
import type {
  IAttachSourcingOptionBody,
  ICreateProjectBody,
  ICreateSpecItemBody,
  IGetProjectFilterQuery,
  IProjectDb,
  IProjectStatus,
  IProjectSummary,
  ISpecItemDb,
  ISpecItemOptionDb,
  IUpdateSpecItemBody,
} from "./project.schema";
import { BadRequest, NotFound } from "@/utility"; // Standard HTTP errors

@AbstractClass()
export abstract class ProjectServiceInterface {
  abstract getProjects(filters: IGetProjectFilterQuery): Promise<IProjectDb[]>;
  abstract getProjectById(id: number): Promise<IProjectDb>;
  abstract createProject(data: ICreateProjectBody): Promise<IProjectDb>;
  abstract updateProjectStatus(
    id: number,
    status: IProjectStatus,
  ): Promise<IProjectDb>;
  abstract getSpecItems(projectId: number): Promise<ISpecItemDb[]>;
  abstract createSpecItem(
    projectId: number,
    data: ICreateSpecItemBody,
  ): Promise<ISpecItemDb>;
  abstract attachSourcingOption(
    projectId: number,
    specItemId: number,
    data: IAttachSourcingOptionBody,
  ): Promise<void>;
  abstract getSourcingOptions(
    projectId: number,
    specItemId: number,
  ): Promise<ISpecItemOptionDb[]>;
  abstract setWinningOption(
    projectId: number,
    specItemId: number,
    productId: number,
  ): Promise<void>;
  abstract getProjectSummary(projectId: number): Promise<IProjectSummary>;

  abstract updateSpecItem(
    projectId: number,
    specItemId: number,
    data: IUpdateSpecItemBody,
  ): Promise<ISpecItemDb>;
  abstract deleteSpecItem(projectId: number, specItemId: number): Promise<void>;
  abstract deleteSourcingOption(
    projectId: number,
    specItemId: number,
    productId: number,
  ): Promise<void>;
}

@Primary
export class ProjectServicePrimary extends ProjectServiceInterface {
  constructor(private projectRepository: ProjectRepositoryInterface) {
    super();
  }

  async getProjects(filters: IGetProjectFilterQuery): Promise<IProjectDb[]> {
    return await this.projectRepository.getFilteredProjects(filters);
  }

  async getProjectById(id: number): Promise<IProjectDb> {
    const project = await this.projectRepository.getProjectById(id);
    if (!project) throw new NotFound(`Project with ID ${id} not found.`);
    return project;
  }

  async createProject(data: ICreateProjectBody): Promise<IProjectDb> {
    return await this.projectRepository.createProject(data);
  }

  async updateProjectStatus(
    id: number,
    status: IProjectStatus,
  ): Promise<IProjectDb> {
    const project = await this.getProjectById(id);

    // Guardrail: Cannot move to Quoted or Closed unless all spec items have a winning option
    if (status === "quoted" || status === "closed") {
      const specItems = await this.projectRepository.getSpecItems(id);

      for (const item of specItems) {
        const options = await this.projectRepository.getSourcingOptions(
          item.id,
        );
        const hasWinner = options.some((opt) => opt.is_winning);
        if (!hasWinner) {
          throw new BadRequest(
            `Cannot change status to ${status}. Spec item '${item.name}' lacks a winning sourcing option.`,
          );
        }
      }
    }

    return await this.projectRepository.updateProjectStatus(id, status);
  }

  async getSpecItems(projectId: number): Promise<ISpecItemDb[]> {
    await this.getProjectById(projectId); // verify exists
    return await this.projectRepository.getSpecItems(projectId);
  }

  async createSpecItem(
    projectId: number,
    data: ICreateSpecItemBody,
  ): Promise<ISpecItemDb> {
    await this.getProjectById(projectId);
    return await this.projectRepository.createSpecItem(projectId, data);
  }

  async attachSourcingOption(
    projectId: number,
    specItemId: number,
    data: IAttachSourcingOptionBody,
  ): Promise<void> {
    await this.getProjectById(projectId);
    await this.projectRepository.attachSourcingOption(specItemId, data);
  }

  async getSourcingOptions(
    projectId: number,
    specItemId: number,
  ): Promise<ISpecItemOptionDb[]> {
    await this.getProjectById(projectId);
    return await this.projectRepository.getSourcingOptions(specItemId);
  }

  async setWinningOption(
    projectId: number,
    specItemId: number,
    productId: number,
  ): Promise<void> {
    await this.getProjectById(projectId);
    await this.projectRepository.setWinningOption(specItemId, productId);
  }

  async getProjectSummary(projectId: number): Promise<IProjectSummary> {
    await this.getProjectById(projectId);
    return await this.projectRepository.getProjectSummary(projectId);
  }

  private async ensureProjectIsEditable(projectId: number) {
    const project = await this.getProjectById(projectId);
    if (
      project.project_status === "quoted" ||
      project.project_status === "closed"
    ) {
      throw new BadRequest(
        `Cannot modify spec items. Project is already ${project.project_status}.`,
      );
    }
  }

  async updateSpecItem(
    projectId: number,
    specItemId: number,
    data: IUpdateSpecItemBody,
  ): Promise<ISpecItemDb> {
    await this.ensureProjectIsEditable(projectId);

    // If no data provided, just fetch and return current state
    if (Object.keys(data).length === 0) {
      // You might want to implement a getSpecItemById in repo, but for brevity:
      const items = await this.getSpecItems(projectId);
      const item = items.find((i) => i.id === specItemId);
      if (!item) throw new NotFound("Spec item not found");
      return item;
    }

    const updated = await this.projectRepository.updateSpecItem(
      specItemId,
      data,
    );
    if (!updated) throw new NotFound(`Spec Item ${specItemId} not found.`);
    return updated;
  }

  async deleteSpecItem(projectId: number, specItemId: number): Promise<void> {
    await this.ensureProjectIsEditable(projectId);
    const deleted = await this.projectRepository.deleteSpecItem(specItemId);
    if (!deleted) throw new NotFound(`Spec Item ${specItemId} not found.`);
  }

  async deleteSourcingOption(
    projectId: number,
    specItemId: number,
    productId: number,
  ): Promise<void> {
    await this.ensureProjectIsEditable(projectId);
    const deleted = await this.projectRepository.deleteSourcingOption(
      specItemId,
      productId,
    );
    if (!deleted) throw new NotFound(`Sourcing option not found.`);
  }
}
