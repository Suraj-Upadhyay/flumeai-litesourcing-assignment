import { registerControllers } from "@/di/fastify";
import type { FastifyPluginAsync } from "fastify";
import { UomController } from "./uom.controller";

const uomRouter: FastifyPluginAsync = async (app) => {
  registerControllers(app, [UomController]);
};

export { uomRouter };
