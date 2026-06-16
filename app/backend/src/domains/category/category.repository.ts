import { AbstractClass, Primary } from "@/di/injector";
import { asyncLocalStorage, InternalServerError } from "@/utility";
import type { PoolClient } from "pg";
import type {
  ICategoryDb,
  ICreateCategoryBody,
  IGetCategoryFilterQuery,
  IUpdateCategoryBody,
} from "./category.schema";

@AbstractClass()
export abstract class CategoryRepositoryInterface {
  get client() {
    return asyncLocalStorage.getStore()?.get("dbClient") as PoolClient;
  }

  abstract getFilteredCategories(
    filters: IGetCategoryFilterQuery,
  ): Promise<ICategoryDb[]>;
  abstract getCategoryById(id: number): Promise<ICategoryDb | null>;
  abstract createCategory(data: ICreateCategoryBody): Promise<ICategoryDb>;
  abstract updateCategory(
    id: number,
    data: IUpdateCategoryBody,
  ): Promise<ICategoryDb | null>;
  abstract deleteCategory(id: number): Promise<boolean>;
}

@Primary
export class CategoryRepositoryPrimary extends CategoryRepositoryInterface {
  async getFilteredCategories(
    filters: IGetCategoryFilterQuery,
  ): Promise<ICategoryDb[]> {
    try {
      const query = `
        SELECT id, name FROM categories
        WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%')
        ORDER BY name ASC
        LIMIT $2 OFFSET $3;
      `;
      const values = [filters.name || null, filters.limit, filters.offset];
      const { rows } = await this.client.query(query, values);
      return rows;
    } catch (error) {
      console.error("Error in getFilteredCategories: ", error);
      throw new InternalServerError("Could not get categories");
    }
  }

  async getCategoryById(id: number): Promise<ICategoryDb | null> {
    try {
      const query = `SELECT id, name FROM categories WHERE id = $1;`;
      const { rows } = await this.client.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error in getCategoryById: ", error);
      throw new InternalServerError("Could not get category by ID");
    }
  }

  async createCategory(data: ICreateCategoryBody): Promise<ICategoryDb> {
    try {
      const query = `INSERT INTO categories (name) VALUES ($1) RETURNING *;`;
      const { rows } = await this.client.query(query, [data.name]);
      return rows[0];
    } catch (error: any) {
      console.error("Error in createCategory: ", error);
      // Handle postgres unique constraint violation explicitly for better UX
      if (error.code === "23505") {
        throw new InternalServerError(
          `A category with the name '${data.name}' already exists.`,
        );
      }
      throw new InternalServerError("Could not create category");
    }
  }

  async updateCategory(
    id: number,
    data: IUpdateCategoryBody,
  ): Promise<ICategoryDb | null> {
    try {
      if (!data.name) return this.getCategoryById(id);

      const query = `UPDATE categories SET name = $1 WHERE id = $2 RETURNING *;`;
      const { rows } = await this.client.query(query, [data.name, id]);
      return rows[0] || null;
    } catch (error: any) {
      console.error("Error in updateCategory: ", error);
      if (error.code === "23505") {
        throw new InternalServerError(
          `A category with the name '${data.name}' already exists.`,
        );
      }
      throw new InternalServerError("Could not update category");
    }
  }

  async deleteCategory(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM categories WHERE id = $1 RETURNING id;`;
      const { rowCount } = await this.client.query(query, [id]);
      return (rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error in deleteCategory: ", error);
      throw new InternalServerError("Could not delete category");
    }
  }
}
