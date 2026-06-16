import { Controller, Get, Use } from "@/di/fastify";
import { Injectable } from "@/di/injector";
import { UomServiceInterface } from "./uom.service";
import { verifyLogin } from "@/middlewares/auth.middleware";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ApiResponse } from "@/utility/apiresponse.util";

@Injectable
@Controller()
export class UomController {
  constructor(private uomService: UomServiceInterface) {}

  @Get("/uom")
  @Use(verifyLogin)
  async getUoms(req: FastifyRequest, res: FastifyReply) {
    const uoms = await this.uomService.getUoms();
    res
      .status(200)
      .send(new ApiResponse(200, { uoms }, "Fetched units of measure"));
  }
}
