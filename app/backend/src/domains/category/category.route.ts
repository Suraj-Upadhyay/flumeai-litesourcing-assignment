import { registerControllers } from "@/di/fastify";
import type { FastifyPluginAsync } from "fastify";
import { CategoryController } from "./category.controller";

const categoryRouter: FastifyPluginAsync = async (app) => {
  registerControllers(app, [CategoryController]);
};

export { categoryRouter };
