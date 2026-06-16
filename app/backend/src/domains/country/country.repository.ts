import { AbstractClass, Primary } from "@/di/injector";
import { asyncLocalStorage, InternalServerError } from "@/utility";
import type { PoolClient } from "pg";
import type { ICountryDb } from "./country.schema";

@AbstractClass()
export abstract class CountryRepositoryInterface {
  get client() {
    return asyncLocalStorage.getStore()?.get("dbClient") as PoolClient;
  }
  abstract getAllCountries(): Promise<ICountryDb[]>;
}

@Primary
export class CountryRepositoryPrimary extends CountryRepositoryInterface {
  async getAllCountries(): Promise<ICountryDb[]> {
    try {
      const { rows } = await this.client.query(
        `SELECT * FROM countries ORDER BY name ASC;`,
      );
      return rows;
    } catch (error) {
      console.error("Error in getAllCountries:", error);
      throw new InternalServerError("Could not fetch countries");
    }
  }
}
