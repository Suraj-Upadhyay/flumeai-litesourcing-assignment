/* eslint-disable @typescript-eslint/no-explicit-any */
import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import { asyncLocalStorage, uniqueID } from "@/utility";

const CreateRequestContext: FastifyPluginAsync = fp(async (fastify) => {
  fastify.addHook("onRequest", async () => {
    const store = new Map<string, any>();
    store.set("req_id", uniqueID());

    asyncLocalStorage.enterWith(store);
  });
});

export default CreateRequestContext;
