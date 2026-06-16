import { AbstractClass, Primary } from "@/di/injector";
import { asyncLocalStorage, InternalServerError } from "@/utility";
import type { PoolClient } from "pg";
import type {
  IAttachSourcingOptionBody,
  ICreateProjectBody,
  ICreateSpecItemBody,
  IGetProjectFilterQuery,
  IProjectDb,
  IProjectStatus,
  IProjectSummary,
  ISpecItemDb,
  ISpecItemOptionDb,
  IUpdateSpecItemBody,
} from "./project.schema";

@AbstractClass()
export abstract class ProjectRepositoryInterface {
  get client() {
    return asyncLocalStorage.getStore()?.get("dbClient") as PoolClient;
  }

  abstract getFilteredProjects(
    filters: IGetProjectFilterQuery,
  ): Promise<IProjectDb[]>;
  abstract getProjectById(id: number): Promise<IProjectDb | null>;
  abstract createProject(data: ICreateProjectBody): Promise<IProjectDb>;
  abstract updateProjectStatus(
    id: number,
    status: IProjectStatus,
  ): Promise<IProjectDb>;

  abstract getSpecItems(projectId: number): Promise<ISpecItemDb[]>;
  abstract createSpecItem(
    projectId: number,
    data: ICreateSpecItemBody,
  ): Promise<ISpecItemDb>;

  abstract attachSourcingOption(
    specItemId: number,
    data: IAttachSourcingOptionBody,
  ): Promise<void>;
  abstract getSourcingOptions(specItemId: number): Promise<ISpecItemOptionDb[]>;
  abstract setWinningOption(
    specItemId: number,
    productId: number,
  ): Promise<void>;

  abstract getProjectSummary(projectId: number): Promise<IProjectSummary>;

  abstract updateSpecItem(
    specItemId: number,
    data: IUpdateSpecItemBody,
  ): Promise<ISpecItemDb | null>;
  abstract deleteSpecItem(specItemId: number): Promise<boolean>;
  abstract deleteSourcingOption(
    specItemId: number,
    productId: number,
  ): Promise<boolean>;
}

@Primary
export class ProjectRepositoryPrimary extends ProjectRepositoryInterface {
  async getFilteredProjects(
    filters: IGetProjectFilterQuery,
  ): Promise<IProjectDb[]> {
    try {
      const query = `
        SELECT * FROM projects
        WHERE ($1::text IS NULL OR project_name ILIKE '%' || $1 || '%')
          AND ($2::text IS NULL OR client_name ILIKE '%' || $2 || '%')
          AND ($3::text IS NULL OR project_status = $3::project_status)
        ORDER BY id DESC
        LIMIT $4 OFFSET $5;
      `;
      const values = [
        filters.project_name || null,
        filters.client_name || null,
        filters.status || null,
        filters.limit,
        filters.offset,
      ];
      const { rows } = await this.client.query(query, values);
      return rows;
    } catch (error) {
      console.error("Error in getFilteredProjects:", error);
      throw new InternalServerError("Could not get projects");
    }
  }

  async getProjectById(id: number): Promise<IProjectDb | null> {
    const { rows } = await this.client.query(
      `SELECT * FROM projects WHERE id = $1`,
      [id],
    );
    return rows[0] || null;
  }

  async createProject(data: ICreateProjectBody): Promise<IProjectDb> {
    const query = `
      INSERT INTO projects (project_name, client_name) 
      VALUES ($1, $2) RETURNING *;
    `;
    const { rows } = await this.client.query(query, [
      data.project_name,
      data.client_name,
    ]);
    return rows[0];
  }

  async updateProjectStatus(
    id: number,
    status: IProjectStatus,
  ): Promise<IProjectDb> {
    const query = `
      UPDATE projects SET project_status = $2::project_status, updated_at = NOW()
      WHERE id = $1 RETURNING *;
    `;
    const { rows } = await this.client.query(query, [id, status]);
    return rows[0];
  }

  async getSpecItems(projectId: number): Promise<ISpecItemDb[]> {
    const { rows } = await this.client.query(
      `SELECT * FROM spec_items WHERE project_id = $1 ORDER BY id ASC`,
      [projectId],
    );
    return rows;
  }

  async createSpecItem(
    projectId: number,
    data: ICreateSpecItemBody,
  ): Promise<ISpecItemDb> {
    const query = `
      INSERT INTO spec_items (project_id, name, description, category_id, quantity, unit_of_measure_id)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const values = [
      projectId,
      data.name,
      data.description || null,
      data.category_id,
      data.quantity,
      data.unit_of_measure_id,
    ];
    const { rows } = await this.client.query(query, values);
    return rows[0];
  }

  async attachSourcingOption(
    specItemId: number,
    data: IAttachSourcingOptionBody,
  ): Promise<void> {
    const query = `
      INSERT INTO spec_item_products (spec_item_id, product_id) 
      VALUES ($1, $2) ON CONFLICT DO NOTHING;
    `;
    await this.client.query(query, [specItemId, data.product_id]);
  }

  async getSourcingOptions(specItemId: number): Promise<ISpecItemOptionDb[]> {
    const query = `
      SELECT sip.spec_item_id, sip.product_id, sip.is_winning,
             p.product_name, p.unit_price, p.currency, p.lead_time_days,
             s.name as supplier_name
      FROM spec_item_products sip
      JOIN products p ON sip.product_id = p.id
      JOIN suppliers s ON p.supplier_id = s.id
      WHERE sip.spec_item_id = $1;
    `;
    const { rows } = await this.client.query(query, [specItemId]);
    return rows;
  }

  async setWinningOption(specItemId: number, productId: number): Promise<void> {
    // Elegant trick to set only one row to true and the rest to false
    const query = `
      UPDATE spec_item_products 
      SET is_winning = (product_id = $2)
      WHERE spec_item_id = $1;
    `;
    await this.client.query(query, [specItemId, productId]);
  }

  async getProjectSummary(projectId: number): Promise<IProjectSummary> {
    // Calculates summary metrics strictly based on winning options
    const query = `
      SELECT 
        $1::int AS project_id,
        COALESCE(SUM(p.unit_price * si.quantity), 0) AS total_estimated_cost,
        COUNT(DISTINCT p.supplier_id) AS suppliers_involved,
        COALESCE(MAX(p.lead_time_days), 0) AS longest_lead_time_days
      FROM spec_items si
      JOIN spec_item_products sip ON si.id = sip.spec_item_id AND sip.is_winning = true
      JOIN products p ON sip.product_id = p.id
      WHERE si.project_id = $1;
    `;
    const { rows } = await this.client.query(query, [projectId]);
    return rows[0];
  }

  async updateSpecItem(
    specItemId: number,
    data: IUpdateSpecItemBody,
  ): Promise<ISpecItemDb | null> {
    // Dynamic update query builder for partial updates
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.category_id !== undefined) {
      fields.push(`category_id = $${paramIndex++}`);
      values.push(data.category_id);
    }
    if (data.quantity !== undefined) {
      fields.push(`quantity = $${paramIndex++}`);
      values.push(data.quantity);
    }
    if (data.unit_of_measure_id !== undefined) {
      fields.push(`unit_of_measure_id = $${paramIndex++}`);
      values.push(data.unit_of_measure_id);
    }

    if (fields.length === 0) return null; // Nothing to update

    fields.push(`updated_at = NOW()`);
    values.push(specItemId);

    const query = `
    UPDATE spec_items 
    SET ${fields.join(", ")} 
    WHERE id = $${paramIndex} 
    RETURNING *;
  `;

    const { rows } = await this.client.query(query, values);
    return rows[0] || null;
  }

  async deleteSpecItem(specItemId: number): Promise<boolean> {
    const query = `DELETE FROM spec_items WHERE id = $1 RETURNING id;`;
    const { rowCount } = await this.client.query(query, [specItemId]);
    return (rowCount ?? 0) > 0;
  }

  async deleteSourcingOption(
    specItemId: number,
    productId: number,
  ): Promise<boolean> {
    const query = `
    DELETE FROM spec_item_products 
    WHERE spec_item_id = $1 AND product_id = $2 
    RETURNING spec_item_id;
  `;
    const { rowCount } = await this.client.query(query, [
      specItemId,
      productId,
    ]);
    return (rowCount ?? 0) > 0;
  }
}
