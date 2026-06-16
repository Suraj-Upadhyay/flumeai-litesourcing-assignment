import { AbstractClass, Primary } from "@/di/injector";
import { asyncLocalStorage, InternalServerError } from "@/utility";
import type { PoolClient } from "pg";
import type {
  IGetProductFilterQuery,
  IProductJoinedDb,
} from "./product.schema";

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
          AND ($2::int IS NULL OR p.category_id = $2)
          AND ($3::int IS NULL OR p.supplier_id = $3)
        ORDER BY p.id DESC
        LIMIT $4 OFFSET $5;
      `;
      const values = [
        filters.query || null,
        filters.category_id || null,
        filters.supplier_id || null,
        filters.limit,
        filters.offset,
      ];
      const { rows } = await this.client.query(query, values);
      return rows;
    } catch (error) {
      console.error("Error in getGlobalProducts:", error);
      throw new InternalServerError("Could not search products");
    }
  }
}
