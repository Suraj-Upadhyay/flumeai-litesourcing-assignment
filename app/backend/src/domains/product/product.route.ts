import { registerControllers } from "@/di/fastify";
import type { FastifyPluginAsync } from "fastify";
import { ProductController } from "./product.controller";

const productRouter: FastifyPluginAsync = async (app) => {
  registerControllers(app, [ProductController]);
};

export { productRouter };
