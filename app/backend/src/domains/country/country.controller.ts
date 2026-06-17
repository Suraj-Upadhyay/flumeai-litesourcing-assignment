import { Controller, Get, Use } from "@/di/fastify";
import { Injectable } from "@/di/injector";
import { CountryServiceInterface } from "./country.service";
import { verifyLogin } from "@/middlewares/auth.middleware";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ApiResponse } from "@/utility/apiresponse.util";

@Injectable
@Controller()
export class CountryController {
  constructor(private countryService: CountryServiceInterface) {}

  @Get("/country")
  @Use(verifyLogin)
  async getCountries(req: FastifyRequest, res: FastifyReply) {
    const countries = await this.countryService.getCountries();
    res.status(200).send(new ApiResponse(200, countries, "Fetched countries"));
  }
}
