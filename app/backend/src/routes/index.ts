import type { FastifyPluginAsync } from "fastify";
import { authRouter } from "@domains/auth/auth.route";

export const routes: { prefix: string; plugin: FastifyPluginAsync }[] = [
  { prefix: "/auth", plugin: authRouter },
];

const v1Router: FastifyPluginAsync = async (app) => {
  for (const { plugin, prefix } of routes) {
    await app.register(plugin, { prefix });
  }
};

export { v1Router };
