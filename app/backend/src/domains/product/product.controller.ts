import { Controller, Get, QuerySchema, Use } from "@/di/fastify";
import { Injectable } from "@/di/injector";
import { ProductServiceInterface } from "./product.service";
import { verifyLogin } from "@/middlewares/auth.middleware";
import type { FastifyReply, FastifyRequest } from "fastify";
import {
  GetProductFilterQuerySchema,
  type IGetProductFilterQuery,
} from "./product.schema";
import { ApiResponse } from "@/utility/apiresponse.util";

@Injectable
@Controller()
export class ProductController {
  constructor(private productService: ProductServiceInterface) {}

  @Get("/product")
  @Use(verifyLogin)
  @QuerySchema(GetProductFilterQuerySchema)
  async getProducts(
    req: FastifyRequest<{ Querystring: IGetProductFilterQuery }>,
    res: FastifyReply,
  ) {
    const products = await this.productService.getProducts(req.query);
    res
      .status(200)
      .send(new ApiResponse(200, { products }, "Fetched global products"));
  }
}
