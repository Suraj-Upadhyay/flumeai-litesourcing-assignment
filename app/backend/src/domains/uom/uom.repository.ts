import { AbstractClass, Primary } from "@/di/injector";
import { asyncLocalStorage, InternalServerError } from "@/utility";
import type { PoolClient } from "pg";
import type { IUomDb } from "./uom.schema";
import { Query } from "@/db";

@AbstractClass()
export abstract class UomRepositoryInterface {
  get client() {
    return asyncLocalStorage.getStore()?.get("dbClient") as PoolClient;
  }
  abstract getAllUoms(): Promise<IUomDb[]>;
}

@Primary
export class UomRepositoryPrimary extends UomRepositoryInterface {
  @Query
  async getAllUoms(): Promise<IUomDb[]> {
    try {
      const { rows } = await this.client.query(
        `SELECT id, name FROM units_of_measure ORDER BY name ASC;`,
      );
      return rows;
    } catch (error) {
      console.error("Error in getAllUoms:", error);
      throw new InternalServerError("Could not fetch units of measure");
    }
  }
}
