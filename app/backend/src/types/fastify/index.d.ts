import type { IToken } from "./token.type";

declare module "fastify" {
  export interface FastifyRequest {
    token?: IToken;
    __context: Map;
  }
}
