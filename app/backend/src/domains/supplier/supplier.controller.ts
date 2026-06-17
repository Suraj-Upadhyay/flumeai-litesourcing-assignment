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
import { SourcingServiceInterface } from "./supplier.service";
import { verifyLogin } from "@/middlewares/auth.middleware";
import type { FastifyReply, FastifyRequest } from "fastify";
import {
  GetSupplierFilterQuerySchema,
  GetProductFilterQuerySchema,
  SupplierIdParamSchema,
  CreateSupplierBodySchema,
  UpdateSupplierBodySchema,
  CreateProductBodySchema,
  type IGetSupplierFilterQuery,
  type IGetProductFilterQuery,
  type ISupplierIdParam,
  type ICreateSupplierBody,
  type IUpdateSupplierBody,
  type ICreateProductBody,
  ProductIdParamSchema,
  UpdateProductBodySchema,
  type IProductIdParam,
  type IUpdateProductBody,
} from "./supplier.schema";
import { ApiResponse } from "@/utility/apiresponse.util";

@Injectable
@Controller()
export class SourcingController {
  constructor(private sourcingService: SourcingServiceInterface) {}

  @Get("/supplier")
  @Use(verifyLogin)
  @QuerySchema(GetSupplierFilterQuerySchema)
  async getSuppliers(
    req: FastifyRequest<{ Querystring: IGetSupplierFilterQuery }>,
    res: FastifyReply,
  ) {
    const suppliers = await this.sourcingService.getSuppliers(req.query);
    res
      .status(200)
      .send(new ApiResponse(200, suppliers, "Successfully fetched suppliers"));
  }

  @Get("/supplier/:supplierId")
  @Use(verifyLogin)
  @ParamSchema(SupplierIdParamSchema)
  async getSupplierById(
    req: FastifyRequest<{ Params: ISupplierIdParam }>,
    res: FastifyReply,
  ) {
    const supplier = await this.sourcingService.getSupplierById(
      req.params.supplierId,
    );
    res
      .status(200)
      .send(
        new ApiResponse(200, supplier, "Successfully fetched supplier details"),
      );
  }

  @Get("/supplier/:supplierId/product")
  @Use(verifyLogin)
  @ParamSchema(SupplierIdParamSchema)
  @QuerySchema(GetProductFilterQuerySchema)
  async getSupplierProductsBySupplierId(
    req: FastifyRequest<{
      Params: ISupplierIdParam;
      Querystring: IGetProductFilterQuery;
    }>,
    res: FastifyReply,
  ) {
    const products = await this.sourcingService.getSupplierProducts(
      req.params.supplierId,
      req.query,
    );
    res
      .status(200)
      .send(
        new ApiResponse(
          200,
          products,
          "Successfully fetched supplier products",
        ),
      );
  }

  @Post("/supplier")
  @Use(verifyLogin)
  @BodySchema(CreateSupplierBodySchema)
  async createSupplier(
    req: FastifyRequest<{ Body: ICreateSupplierBody }>,
    res: FastifyReply,
  ) {
    const supplier = await this.sourcingService.createSupplier(req.body);
    res
      .status(201)
      .send(new ApiResponse(201, supplier, "Successfully created supplier"));
  }

  @Post("/supplier/:supplierId/product")
  @Use(verifyLogin)
  @ParamSchema(SupplierIdParamSchema)
  @BodySchema(CreateProductBodySchema)
  async createSupplierProduct(
    req: FastifyRequest<{ Params: ISupplierIdParam; Body: ICreateProductBody }>,
    res: FastifyReply,
  ) {
    const product = await this.sourcingService.createSupplierProduct(
      req.params.supplierId,
      req.body,
    );
    res
      .status(201)
      .send(
        new ApiResponse(
          201,
          product,
          "Successfully created product for supplier",
        ),
      );
  }

  @Patch("/supplier/:supplierId")
  @Use(verifyLogin)
  @ParamSchema(SupplierIdParamSchema)
  @BodySchema(UpdateSupplierBodySchema)
  async modifySupplierById(
    req: FastifyRequest<{
      Params: ISupplierIdParam;
      Body: IUpdateSupplierBody;
    }>,
    res: FastifyReply,
  ) {
    const supplier = await this.sourcingService.updateSupplier(
      req.params.supplierId,
      req.body,
    );
    res
      .status(200)
      .send(new ApiResponse(200, supplier, "Successfully updated supplier"));
  }

  @Delete("/supplier/:supplierId")
  @Use(verifyLogin)
  @ParamSchema(SupplierIdParamSchema)
  async deleteSupplierByid(
    req: FastifyRequest<{ Params: ISupplierIdParam }>,
    res: FastifyReply,
  ) {
    await this.sourcingService.deleteSupplier(req.params.supplierId);
    res
      .status(200)
      .send(new ApiResponse(200, null, "Successfully deleted supplier"));
  }

  @Patch("/supplier/:supplierId/product/:productId")
  @Use(verifyLogin)
  @ParamSchema(ProductIdParamSchema)
  @BodySchema(UpdateProductBodySchema)
  async updateSupplierProduct(
    req: FastifyRequest<{ Params: IProductIdParam; Body: IUpdateProductBody }>,
    res: FastifyReply,
  ) {
    const product = await this.sourcingService.updateSupplierProduct(
      req.params.supplierId,
      req.params.productId,
      req.body,
    );
    res
      .status(200)
      .send(
        new ApiResponse(200, product, "Successfully updated supplier product"),
      );
  }

  @Delete("/supplier/:supplierId/product/:productId")
  @Use(verifyLogin)
  @ParamSchema(ProductIdParamSchema)
  async deleteSupplierProduct(
    req: FastifyRequest<{ Params: IProductIdParam }>,
    res: FastifyReply,
  ) {
    await this.sourcingService.deleteSupplierProduct(
      req.params.supplierId,
      req.params.productId,
    );
    res
      .status(200)
      .send(
        new ApiResponse(200, null, "Successfully deleted supplier product"),
      );
  }
}
