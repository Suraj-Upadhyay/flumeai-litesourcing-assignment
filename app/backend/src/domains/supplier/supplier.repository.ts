import { AbstractClass, Primary } from "@/di/injector";
import { asyncLocalStorage, InternalServerError } from "@/utility";
import type { PoolClient } from "pg";
import type {
  ICreateProductBody,
  ICreateSupplierBody,
  IGetProductFilterQuery,
  IGetSupplierFilterQuery,
  IProductFilterResult,
  ISupplierFilterResult,
  IUpdateProductBody,
  IUpdateSupplierBody,
} from "./supplier.schema";
import { Query } from "@/db";

@AbstractClass()
export abstract class SourcingRepositoryInterface {
  get client() {
    return asyncLocalStorage.getStore()?.get("dbClient") as PoolClient;
  }

  abstract getFilteredSuppliers(
    filters: IGetSupplierFilterQuery,
  ): Promise<ISupplierFilterResult[]>;
  abstract getSupplierById(id: number): Promise<ISupplierFilterResult | null>;
  abstract getSupplierProducts(
    supplierId: number,
    filters: IGetProductFilterQuery,
  ): Promise<IProductFilterResult[]>;
  abstract createSupplier(
    data: ICreateSupplierBody,
  ): Promise<ISupplierFilterResult>;
  abstract updateSupplier(
    id: number,
    data: IUpdateSupplierBody,
  ): Promise<ISupplierFilterResult | null>;
  abstract deleteSupplier(id: number): Promise<boolean>;
  abstract createSupplierProduct(
    supplierId: number,
    data: ICreateProductBody,
  ): Promise<IProductFilterResult>;
  abstract updateSupplierProduct(
    supplierId: number,
    productId: number,
    data: IUpdateProductBody,
  ): Promise<any | null>; // Replace 'any' with your actual IProductDb type
  abstract deleteSupplierProduct(
    supplierId: number,
    productId: number,
  ): Promise<boolean>;
}

@Primary
export class SourcingRepositoryPrimary extends SourcingRepositoryInterface {
  @Query
  async getFilteredSuppliers(
    filters: IGetSupplierFilterQuery,
  ): Promise<ISupplierFilterResult[]> {
    try {
      const query = `
        SELECT id, name, country, website
        FROM suppliers
        WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%')
          AND ($2::text IS NULL OR country ILIKE '%' || $2 || '%')
        ORDER BY id DESC
        LIMIT $3 OFFSET $4;
      `;
      const values = [
        filters.name || null,
        filters.country || null,
        filters.limit,
        filters.offset,
      ];
      const { rows } = await this.client.query(query, values);
      return rows;
    } catch (error) {
      console.error("Error in getFilteredSuppliers: ", error);
      throw new InternalServerError("Could not getFilteredSuppliers");
    }
  }

  @Query
  async getSupplierById(id: number): Promise<ISupplierFilterResult | null> {
    try {
      const query = `SELECT id, name, country, website FROM suppliers WHERE id = $1;`;
      const { rows } = await this.client.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error in getSupplierById: ", error);
      throw new InternalServerError("Could not getSupplierById");
    }
  }

  @Query
  async getSupplierProducts(
    supplierId: number,
    filters: IGetProductFilterQuery,
  ): Promise<IProductFilterResult[]> {
    try {
      const query = `
        SELECT p.*, c.name as category_name, u.name as unit_of_measure_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        JOIN units_of_measure u ON p.unit_of_measure_id = u.id
        WHERE p.supplier_id = $1
          AND ($2::text IS NULL OR p.product_name ILIKE '%' || $2 || '%')
          AND ($3::text IS NULL OR c.name ILIKE '%' || $3 || '%')
        ORDER BY p.id DESC
        LIMIT $4 OFFSET $5;
      `;
      const values = [
        supplierId,
        filters.product_name || null,
        filters.category_name || null,
        filters.limit,
        filters.offset,
      ];
      const { rows } = await this.client.query(query, values);
      return rows;
    } catch (error) {
      console.error("Error in getSupplierProducts: ", error);
      throw new InternalServerError("Could not getSupplierProducts");
    }
  }

  @Query
  async createSupplier(
    data: ICreateSupplierBody,
  ): Promise<ISupplierFilterResult> {
    try {
      const query = `
        INSERT INTO suppliers (name, country, website) 
        VALUES ($1, $2, $3) 
        RETURNING *;
      `;
      const { rows } = await this.client.query(query, [
        data.name,
        data.country,
        data.website,
      ]);
      return rows[0];
    } catch (error) {
      console.error("Error in createSupplier: ", error);
      throw new InternalServerError("Could not createSupplier");
    }
  }

  @Query
  async updateSupplier(
    id: number,
    data: IUpdateSupplierBody,
  ): Promise<ISupplierFilterResult | null> {
    try {
      const entries = Object.entries(data).filter(([_, v]) => v !== undefined);
      if (entries.length === 0) return this.getSupplierById(id);

      const setClause = entries
        .map(([key, _], idx) => `${key} = $${idx + 2}`)
        .join(", ");
      const values = entries.map(([_, val]) => val);

      const query = `
        UPDATE suppliers 
        SET ${setClause} 
        WHERE id = $1 
        RETURNING *;
      `;
      const { rows } = await this.client.query(query, [id, ...values]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error in updateSupplier: ", error);
      throw new InternalServerError("Could not updateSupplier");
    }
  }

  @Query
  async deleteSupplier(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM suppliers WHERE id = $1 RETURNING id;`;
      const { rowCount } = await this.client.query(query, [id]);
      return (rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error in deleteSupplier: ", error);
      throw new InternalServerError("Could not deleteSupplier");
    }
  }

  @Query
  async createSupplierProduct(
    supplierId: number,
    data: ICreateProductBody,
  ): Promise<IProductFilterResult> {
    try {
      const query = `
        INSERT INTO products (product_name, category_id, supplier_id, unit_price, currency, unit_of_measure_id, lead_time_days)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const values = [
        data.product_name,
        data.category_id,
        supplierId,
        data.unit_price,
        data.currency,
        data.unit_of_measure_id,
        data.lead_time_days,
      ];
      const { rows } = await this.client.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("Error in createSupplierProduct: ", error);
      throw new InternalServerError("Could not createSupplierProduct");
    }
  }

  @Query
  async updateSupplierProduct(
    supplierId: number,
    productId: number,
    data: IUpdateProductBody,
  ) {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.product_name !== undefined) {
      fields.push(`product_name = $${paramIndex++}`);
      values.push(data.product_name);
    }
    if (data.category_id !== undefined) {
      fields.push(`category_id = $${paramIndex++}`);
      values.push(data.category_id);
    }
    if (data.unit_price !== undefined) {
      fields.push(`unit_price = $${paramIndex++}`);
      values.push(data.unit_price);
    }
    if (data.currency !== undefined) {
      fields.push(`currency = $${paramIndex++}`);
      values.push(data.currency);
    }
    if (data.unit_of_measure_id !== undefined) {
      fields.push(`unit_of_measure_id = $${paramIndex++}`);
      values.push(data.unit_of_measure_id);
    }
    if (data.lead_time_days !== undefined) {
      fields.push(`lead_time_days = $${paramIndex++}`);
      values.push(data.lead_time_days);
    }

    if (fields.length === 0) return null;

    // Ensure we only update if the product actually belongs to this supplier
    values.push(productId, supplierId);

    const query = `
    UPDATE products 
    SET ${fields.join(", ")} 
    WHERE id = $${paramIndex} AND supplier_id = $${paramIndex + 1}
    RETURNING *;
  `;

    const { rows } = await this.client.query(query, values);
    return rows[0] || null;
  }

  @Query
  async deleteSupplierProduct(
    supplierId: number,
    productId: number,
  ): Promise<boolean> {
    const query = `
    DELETE FROM products 
    WHERE id = $1 AND supplier_id = $2 
    RETURNING id;
  `;
    const { rowCount } = await this.client.query(query, [
      productId,
      supplierId,
    ]);
    return (rowCount ?? 0) > 0;
  }
}
