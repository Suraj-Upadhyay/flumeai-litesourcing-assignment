import { registerControllers } from "@/di/fastify";
import type { FastifyPluginAsync } from "fastify";
import { SourcingController } from "./supplier.controller";

const sourcingRouter: FastifyPluginAsync = async (app) => {
  registerControllers(app, [SourcingController]);
};

export { sourcingRouter };
