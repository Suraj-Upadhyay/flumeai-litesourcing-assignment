import { AbstractClass, Primary } from "@/di/injector";
import { asyncLocalStorage, InternalServerError } from "@/utility";
import type { PoolClient } from "pg";
import type {
  IGetProductFilterQuery,
  IProductJoinedDb,
} from "./product.schema";
import { Query } from "@/db";

@AbstractClass()
export abstract class ProductRepositoryInterface {
  get client() {
    return asyncLocalStorage.getStore()?.get("dbClient") as PoolClient;
  }
  abstract getGlobalProducts(
    filters: IGetProductFilterQuery,
  ): Promise<IProductJoinedDb[]>;
}

@Primary
export class ProductRepositoryPrimary extends ProductRepositoryInterface {
  @Query
  async getGlobalProducts(
    filters: IGetProductFilterQuery,
  ): Promise<IProductJoinedDb[]> {
    try {
      const query = `
        SELECT 
          p.*,
          s.name as supplier_name,
          c.name as category_name,
          u.name as unit_of_measure_name
        FROM products p
        JOIN suppliers s ON p.supplier_id = s.id
        JOIN categories c ON p.category_id = c.id
        JOIN units_of_measure u ON p.unit_of_measure_id = u.id
        WHERE ($1::text IS NULL OR p.product_name ILIKE '%' || $1 || '%')
          AND ($2::int[] IS NULL OR p.category_id = ANY($2::int[]))
          AND ($3::int[] IS NULL OR p.supplier_id = ANY($3::int[]))
        ORDER BY p.id DESC
        LIMIT $4 OFFSET $5;
      `;

      // Helper to force an array and format as Postgres array string {1,2}
      const formatArray = (input: any) => {
        if (!input) return null;
        // Ensure input is an array
        const arr = Array.isArray(input) ? input : [input];
        return arr.length > 0 ? `{${arr.join(",")}}` : null;
      };

      const values = [
        filters.query || null,
        formatArray(filters.category_ids),
        formatArray(filters.supplier_ids),
        filters.limit || 20,
        filters.offset || 0,
      ];

      const { rows } = await this.client.query(query, values);
      return rows;
    } catch (error) {
      console.error("Error in getGlobalProducts:", error);
      throw new InternalServerError("Could not search products");
    }
  }
}
