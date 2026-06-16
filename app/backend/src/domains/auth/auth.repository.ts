import { AbstractClass, Primary } from "@/di/injector";
import {
  asyncLocalStorage,
  BadRequest,
  InternalServerError,
  NotFound,
} from "@/utility";
import { DatabaseError, type PoolClient } from "pg";
import type { InsertUser } from "@/db/models/user.model";
import { Query } from "@/db";
import { UniqueConstraintDBErrorCode } from "@/config";

@AbstractClass()
export abstract class AuthRepositoryInterface {
  get client() {
    return asyncLocalStorage.getStore()?.get("dbClient") as PoolClient;
  }

  abstract createUser(insertUser: InsertUser): Promise<void>;
  abstract getHashedUserPassword(username: string): Promise<string>;
}

@Primary
export class AuthRepository extends AuthRepositoryInterface {
  @Query
  async createUser(insertUser: InsertUser): Promise<void> {
    try {
      const query = `
        insert into users (username, password_hash) values
          ($1, $2);
      `;
      const values = [insertUser.username, insertUser.password_hash];
      await this.client.query(query, values);
    } catch (error) {
      if (
        error instanceof DatabaseError &&
        error.code === UniqueConstraintDBErrorCode
      ) {
        throw new BadRequest("user already exists");
      }
      console.error("An error occurred in createUser: ", error);
      throw new InternalServerError("Could not create the user");
    }
  }

  @Query
  async getHashedUserPassword(username: string): Promise<string> {
    try {
      const query = `select password_hash from users where username = $1`;
      const values = [username];
      const { rowCount, rows } = await this.client.query(query, values);
      if (rowCount === 0) throw new NotFound("username not found");
      return rows[0].password_hash;
    } catch (error) {
      console.error("An error occurred in getHashedUserPassword: ", error);
      throw new InternalServerError("Could not ");
    }
  }
}
