import { BodySchema, Controller, Get, Post, Use } from "@/di/fastify";
import { Injectable } from "@/di/injector";
import { AuthServiceInterface } from "./auth.service";
import type { FastifyReply, FastifyRequest } from "fastify";
import {
  LoginSchema,
  SignupSchema,
  type ILoginRequest,
  type ISignupRequest,
} from "./auth.schema";
import { getEnvironmentConfig, MONTH_IN_MS, UserTokenName } from "@/config";
import type { CookieSerializeOptions } from "@fastify/cookie";
import jwt from "jsonwebtoken";
import { verifyLogin } from "@/middlewares/auth.middleware";

@Injectable
@Controller()
export class AuthController {
  constructor(private authService: AuthServiceInterface) {}

  @Post("/signup")
  @BodySchema(SignupSchema)
  async signup(
    req: FastifyRequest<{ Body: ISignupRequest }>,
    res: FastifyReply,
  ) {
    const signupRequest = req.body;
    await this.authService.signup(signupRequest);

    const serverDomain = getEnvironmentConfig().SERVER_DOMAIN;
    const jwtSecret = getEnvironmentConfig().JWT_SECRET;
    const nodeEnv = getEnvironmentConfig().NODE_ENV;

    const options = {
      domain: serverDomain || "",
      maxAge: MONTH_IN_MS / 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: nodeEnv === "production" ? true : false,
      path: "/",
    } as CookieSerializeOptions;

    const jwtToken = jwt.sign({ username: signupRequest.username }, jwtSecret, {
      expiresIn: MONTH_IN_MS,
    });

    res.status(201).cookie(UserTokenName, jwtToken, options);
  }

  @Post("/login")
  @BodySchema(LoginSchema)
  async login(req: FastifyRequest<{ Body: ILoginRequest }>, res: FastifyReply) {
    const loginRequest = req.body;
    await this.authService.login(loginRequest);

    const serverDomain = getEnvironmentConfig().SERVER_DOMAIN;
    const jwtSecret = getEnvironmentConfig().JWT_SECRET;
    const nodeEnv = getEnvironmentConfig().NODE_ENV;

    const options = {
      domain: serverDomain || "",
      maxAge: MONTH_IN_MS / 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: nodeEnv === "production" ? true : false,
      path: "/",
    } as CookieSerializeOptions;

    const jwtToken = jwt.sign({ username: loginRequest.username }, jwtSecret, {
      expiresIn: MONTH_IN_MS,
    });

    res.status(200).cookie(UserTokenName, jwtToken, options);
  }

  @Get("/logout")
  @Use(verifyLogin)
  async logout(_: FastifyRequest, res: FastifyReply) {
    const serverDomain = getEnvironmentConfig().SERVER_DOMAIN;
    const options = {
      domain: serverDomain || "",
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    } as CookieSerializeOptions;

    res.status(200).clearCookie(UserTokenName, options);
  }
}
