import { registerControllers } from "@/di/fastify";
import type { FastifyPluginAsync } from "fastify";
import { CountryController } from "./country.controller";

const countryRouter: FastifyPluginAsync = async (app) => {
  registerControllers(app, [CountryController]);
};

export { countryRouter };
