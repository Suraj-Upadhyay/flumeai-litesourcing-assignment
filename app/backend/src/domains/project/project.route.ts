import { registerControllers } from "@/di/fastify";
import type { FastifyPluginAsync } from "fastify";
import { ProjectController } from "./project.controller";

const projectRouter: FastifyPluginAsync = async (app) => {
  registerControllers(app, [ProjectController]);
};

export { projectRouter };
