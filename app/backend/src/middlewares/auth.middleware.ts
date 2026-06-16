import jwt from "jsonwebtoken";
import { Unauthorized } from "../utility/error.util";
import type { FastifyRequest } from "fastify";
import { getEnvironmentConfig, UserTokenName } from "@/config";
import type { IToken } from "@/types/token.type";

export const verifyJWT = (tokenName: string) => {
  return async (req: FastifyRequest) => {
    const token = req.cookies[tokenName];

    console.log("token: ", token);

    if (!token) {
      throw new Unauthorized("Unauthorized request");
    }

    const jwtSecret = getEnvironmentConfig().JWT_SECRET;

    const decodedToken = jwt.verify(
      token,
      jwtSecret as string,
    ) as unknown as IToken;

    req.token = { ...req.token, ...decodedToken };
  };
};

export const verifyLogin = [verifyJWT(UserTokenName)];
