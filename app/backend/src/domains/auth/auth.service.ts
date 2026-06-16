import { AbstractClass, Primary } from "@/di/injector";
import type { ILoginRequest, ISignupRequest } from "./auth.schema";
import { AuthRepositoryInterface } from "./auth.repository";
import { getEnvironmentConfig, UniqueConstraintDBErrorCode } from "@/config";
import bcrypt from "bcryptjs";
import type { InsertUser } from "@/db/models/user.model";
import { InternalServerError, Unauthorized } from "@/utility";
import { Transaction } from "@/db";

@AbstractClass()
export abstract class AuthServiceInterface {
  abstract signup(signupRequest: ISignupRequest): Promise<void>;
  abstract login(loginRequest: ILoginRequest): Promise<void>;
}

@Primary
export class AuthServicePrimary extends AuthServiceInterface {
  constructor(private authRepository: AuthRepositoryInterface) {
    super();
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      const SALT_ROUNDS = getEnvironmentConfig().SALT_ROUNDS;
      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      return hash;
    } catch (error) {
      console.error("An error occurred in hashPassword: ", error);
      throw new InternalServerError();
    }
  }

  @Transaction
  async signup(signupRequest: ISignupRequest): Promise<void> {
    const hashedPassword = await this.hashPassword(signupRequest.password);
    const insertUser: InsertUser = {
      username: signupRequest.username,
      password_hash: hashedPassword,
    };

    await this.authRepository.createUser(insertUser);
  }

  async login(loginRequest: ILoginRequest): Promise<void> {
    const hashedPassword = await this.authRepository.getHashedUserPassword(
      loginRequest.username,
    );

    const isMatch = await bcrypt.compare(loginRequest.password, hashedPassword);

    if (!isMatch) throw new Unauthorized("username or password is incorrect");
  }
}
