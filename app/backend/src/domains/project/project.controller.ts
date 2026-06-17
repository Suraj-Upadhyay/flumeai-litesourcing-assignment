import {
  Controller,
  Get,
  Patch,
  Post,
  QuerySchema,
  ParamSchema,
  BodySchema,
  Use,
  Delete,
} from "@/di/fastify";
import { Injectable } from "@/di/injector";
import { ProjectServiceInterface } from "./project.service";
import { verifyLogin } from "@/middlewares/auth.middleware";
import type { FastifyReply, FastifyRequest } from "fastify";
import {
  GetProjectFilterQuerySchema,
  ProjectIdParamSchema,
  SpecItemIdParamSchema,
  WinningOptionParamSchema,
  CreateProjectBodySchema,
  UpdateProjectStatusBodySchema,
  CreateSpecItemBodySchema,
  AttachSourcingOptionBodySchema,
  type IGetProjectFilterQuery,
  type IProjectIdParam,
  type ISpecItemIdParam,
  type IWinningOptionParam,
  type ICreateProjectBody,
  type IUpdateProjectStatusBody,
  type ICreateSpecItemBody,
  type IAttachSourcingOptionBody,
  UpdateSpecItemBodySchema,
  type IUpdateSpecItemBody,
  DeleteSourcingOptionParamSchema,
  type IDeleteSourcingOptionParam,
} from "./project.schema";
import { ApiResponse } from "@/utility/apiresponse.util";

@Injectable
@Controller()
export class ProjectController {
  constructor(private projectService: ProjectServiceInterface) {}

  @Get("/project")
  @Use(verifyLogin)
  @QuerySchema(GetProjectFilterQuerySchema)
  async getProjects(
    req: FastifyRequest<{ Querystring: IGetProjectFilterQuery }>,
    res: FastifyReply,
  ) {
    const projects = await this.projectService.getProjects(req.query);
    res.status(200).send(new ApiResponse(200, projects, "Fetched projects"));
  }

  @Post("/project")
  @Use(verifyLogin)
  @BodySchema(CreateProjectBodySchema)
  async createProject(
    req: FastifyRequest<{ Body: ICreateProjectBody }>,
    res: FastifyReply,
  ) {
    const project = await this.projectService.createProject(req.body);
    res.status(201).send(new ApiResponse(201, project, "Project created"));
  }

  @Get("/project/:projectId")
  @Use(verifyLogin)
  @ParamSchema(ProjectIdParamSchema)
  async getProjectById(
    req: FastifyRequest<{ Params: IProjectIdParam }>,
    res: FastifyReply,
  ) {
    const project = await this.projectService.getProjectById(
      req.params.projectId,
    );
    res
      .status(200)
      .send(new ApiResponse(200, project, "Fetched project details"));
  }

  @Get("/project/:projectId/status")
  @Use(verifyLogin)
  @ParamSchema(ProjectIdParamSchema)
  async getProjectStatusById(
    req: FastifyRequest<{ Params: IProjectIdParam }>,
    res: FastifyReply,
  ) {
    const status = await this.projectService.getProjectStatus(
      req.params.projectId,
    );
    res
      .status(200)
      .send(new ApiResponse(200, { status }, "Fetched project status"));
  }

  @Patch("/project/:projectId/status")
  @Use(verifyLogin)
  @ParamSchema(ProjectIdParamSchema)
  @BodySchema(UpdateProjectStatusBodySchema)
  async updateProjectStatus(
    req: FastifyRequest<{
      Params: IProjectIdParam;
      Body: IUpdateProjectStatusBody;
    }>,
    res: FastifyReply,
  ) {
    const project = await this.projectService.updateProjectStatus(
      req.params.projectId,
      req.body.project_status,
    );
    res
      .status(200)
      .send(new ApiResponse(200, project, "Project status updated"));
  }

  @Get("/project/:projectId/summary")
  @Use(verifyLogin)
  @ParamSchema(ProjectIdParamSchema)
  async getProjectSummary(
    req: FastifyRequest<{ Params: IProjectIdParam }>,
    res: FastifyReply,
  ) {
    const summary = await this.projectService.getProjectSummary(
      req.params.projectId,
    );
    res
      .status(200)
      .send(new ApiResponse(200, summary, "Fetched project summary"));
  }

  @Get("/project/:projectId/spec-item")
  @Use(verifyLogin)
  @ParamSchema(ProjectIdParamSchema)
  async getSpecItems(
    req: FastifyRequest<{ Params: IProjectIdParam }>,
    res: FastifyReply,
  ) {
    const specItems = await this.projectService.getSpecItems(
      req.params.projectId,
    );
    res.status(200).send(new ApiResponse(200, specItems, "Fetched spec items"));
  }

  @Post("/project/:projectId/spec-item")
  @Use(verifyLogin)
  @ParamSchema(ProjectIdParamSchema)
  @BodySchema(CreateSpecItemBodySchema)
  async createSpecItem(
    req: FastifyRequest<{ Params: IProjectIdParam; Body: ICreateSpecItemBody }>,
    res: FastifyReply,
  ) {
    const specItem = await this.projectService.createSpecItem(
      req.params.projectId,
      req.body,
    );
    res.status(201).send(new ApiResponse(201, specItem, "Spec item created"));
  }

  @Get("/project/:projectId/spec-item/:specItemId/option")
  @Use(verifyLogin)
  @ParamSchema(SpecItemIdParamSchema)
  async getSourcingOptions(
    req: FastifyRequest<{ Params: ISpecItemIdParam }>,
    res: FastifyReply,
  ) {
    const options = await this.projectService.getSourcingOptions(
      req.params.projectId,
      req.params.specItemId,
    );
    res
      .status(200)
      .send(new ApiResponse(200, options, "Fetched sourcing options"));
  }

  @Post("/project/:projectId/spec-item/:specItemId/option")
  @Use(verifyLogin)
  @ParamSchema(SpecItemIdParamSchema)
  @BodySchema(AttachSourcingOptionBodySchema)
  async attachSourcingOption(
    req: FastifyRequest<{
      Params: ISpecItemIdParam;
      Body: IAttachSourcingOptionBody;
    }>,
    res: FastifyReply,
  ) {
    await this.projectService.attachSourcingOption(
      req.params.projectId,
      req.params.specItemId,
      req.body,
    );
    res
      .status(201)
      .send(new ApiResponse(201, null, "Sourcing option attached"));
  }

  @Patch("/project/:projectId/spec-item/:specItemId/option/:productId/win")
  @Use(verifyLogin)
  @ParamSchema(WinningOptionParamSchema)
  async setWinningOption(
    req: FastifyRequest<{ Params: IWinningOptionParam }>,
    res: FastifyReply,
  ) {
    await this.projectService.setWinningOption(
      req.params.projectId,
      req.params.specItemId,
      req.params.productId,
    );
    res.status(200).send(new ApiResponse(200, null, "Winning option selected"));
  }

  @Patch("/project/:projectId/spec-item/:specItemId")
  @Use(verifyLogin)
  @ParamSchema(SpecItemIdParamSchema)
  @BodySchema(UpdateSpecItemBodySchema)
  async updateSpecItem(
    req: FastifyRequest<{
      Params: ISpecItemIdParam;
      Body: IUpdateSpecItemBody;
    }>,
    res: FastifyReply,
  ) {
    const specItem = await this.projectService.updateSpecItem(
      req.params.projectId,
      req.params.specItemId,
      req.body,
    );
    res.status(200).send(new ApiResponse(200, specItem, "Spec item updated"));
  }

  @Delete("/project/:projectId/spec-item/:specItemId")
  @Use(verifyLogin)
  @ParamSchema(SpecItemIdParamSchema)
  async deleteSpecItem(
    req: FastifyRequest<{ Params: ISpecItemIdParam }>,
    res: FastifyReply,
  ) {
    await this.projectService.deleteSpecItem(
      req.params.projectId,
      req.params.specItemId,
    );
    res.status(200).send(new ApiResponse(200, null, "Spec item deleted"));
  }

  @Delete("/project/:projectId/spec-item/:specItemId/option/:productId")
  @Use(verifyLogin)
  @ParamSchema(DeleteSourcingOptionParamSchema)
  async deleteSourcingOption(
    req: FastifyRequest<{ Params: IDeleteSourcingOptionParam }>,
    res: FastifyReply,
  ) {
    await this.projectService.deleteSourcingOption(
      req.params.projectId,
      req.params.specItemId,
      req.params.productId,
    );
    res.status(200).send(new ApiResponse(200, null, "Sourcing option removed"));
  }
}
