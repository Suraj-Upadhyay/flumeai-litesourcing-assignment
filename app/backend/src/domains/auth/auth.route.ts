import { registerControllers } from "@/di/fastify";
import { AuthController } from "./auth.controller";
import type { FastifyPluginAsync } from "fastify";

const authRouter: FastifyPluginAsync = async (app) => {
  registerControllers(app, [AuthController]);
};

export { authRouter };
