import type { FastifyPluginAsync } from "fastify";

export const routes: { prefix: string; plugin: FastifyPluginAsync }[] = [];

const v1Router: FastifyPluginAsync = async (app) => {
  for (const { plugin, prefix } of routes) {
    await app.register(plugin, { prefix });
  }
};

export { v1Router };
