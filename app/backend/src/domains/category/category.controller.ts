import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  QuerySchema,
  ParamSchema,
  BodySchema,
  Use,
} from "@/di/fastify";
import { Injectable } from "@/di/injector";
import { CategoryServiceInterface } from "./category.service";
import { verifyLogin } from "@/middlewares/auth.middleware";
import type { FastifyReply, FastifyRequest } from "fastify";
import {
  GetCategoryFilterQuerySchema,
  CategoryIdParamSchema,
  CreateCategoryBodySchema,
  UpdateCategoryBodySchema,
  type IGetCategoryFilterQuery,
  type ICategoryIdParam,
  type ICreateCategoryBody,
  type IUpdateCategoryBody,
} from "./category.schema";
import { ApiResponse } from "@/utility/apiresponse.util";

@Injectable
@Controller()
export class CategoryController {
  constructor(private categoryService: CategoryServiceInterface) {}

  @Get("/category")
  @Use(verifyLogin)
  @QuerySchema(GetCategoryFilterQuerySchema)
  async getCategories(
    req: FastifyRequest<{ Querystring: IGetCategoryFilterQuery }>,
    res: FastifyReply,
  ) {
    const categories = await this.categoryService.getCategories(req.query);
    res
      .status(200)
      .send(
        new ApiResponse(200, { categories }, "Successfully fetched categories"),
      );
  }

  @Get("/category/:categoryId")
  @Use(verifyLogin)
  @ParamSchema(CategoryIdParamSchema)
  async getCategoryById(
    req: FastifyRequest<{ Params: ICategoryIdParam }>,
    res: FastifyReply,
  ) {
    const category = await this.categoryService.getCategoryById(
      req.params.categoryId,
    );
    res
      .status(200)
      .send(
        new ApiResponse(
          200,
          { category },
          "Successfully fetched category details",
        ),
      );
  }

  @Post("/category")
  @Use(verifyLogin)
  @BodySchema(CreateCategoryBodySchema)
  async createCategory(
    req: FastifyRequest<{ Body: ICreateCategoryBody }>,
    res: FastifyReply,
  ) {
    const category = await this.categoryService.createCategory(req.body);
    res
      .status(201)
      .send(
        new ApiResponse(201, { category }, "Successfully created category"),
      );
  }

  @Patch("/category/:categoryId")
  @Use(verifyLogin)
  @ParamSchema(CategoryIdParamSchema)
  @BodySchema(UpdateCategoryBodySchema)
  async modifyCategoryById(
    req: FastifyRequest<{
      Params: ICategoryIdParam;
      Body: IUpdateCategoryBody;
    }>,
    res: FastifyReply,
  ) {
    const category = await this.categoryService.updateCategory(
      req.params.categoryId,
      req.body,
    );
    res
      .status(200)
      .send(
        new ApiResponse(200, { category }, "Successfully updated category"),
      );
  }

  @Delete("/category/:categoryId")
  @Use(verifyLogin)
  @ParamSchema(CategoryIdParamSchema)
  async deleteCategoryById(
    req: FastifyRequest<{ Params: ICategoryIdParam }>,
    res: FastifyReply,
  ) {
    await this.categoryService.deleteCategory(req.params.categoryId);
    res
      .status(200)
      .send(new ApiResponse(200, null, "Successfully deleted category"));
  }
}
