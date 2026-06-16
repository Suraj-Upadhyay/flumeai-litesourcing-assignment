import { AbstractClass, Primary } from "@/di/injector";
import { CategoryRepositoryInterface } from "./category.repository";
import type {
  ICategoryDb,
  ICreateCategoryBody,
  IGetCategoryFilterQuery,
  IUpdateCategoryBody,
} from "./category.schema";
import { NotFound } from "@/utility";

@AbstractClass()
export abstract class CategoryServiceInterface {
  abstract getCategories(
    filters: IGetCategoryFilterQuery,
  ): Promise<ICategoryDb[]>;
  abstract getCategoryById(id: number): Promise<ICategoryDb>;
  abstract createCategory(data: ICreateCategoryBody): Promise<ICategoryDb>;
  abstract updateCategory(
    id: number,
    data: IUpdateCategoryBody,
  ): Promise<ICategoryDb>;
  abstract deleteCategory(id: number): Promise<void>;
}

@Primary
export class CategoryServicePrimary extends CategoryServiceInterface {
  constructor(private categoryRepository: CategoryRepositoryInterface) {
    super();
  }

  async getCategories(
    filters: IGetCategoryFilterQuery,
  ): Promise<ICategoryDb[]> {
    return await this.categoryRepository.getFilteredCategories(filters);
  }

  async getCategoryById(id: number): Promise<ICategoryDb> {
    const category = await this.categoryRepository.getCategoryById(id);
    if (!category) {
      throw new NotFound(`Category with ID ${id} not found.`);
    }
    return category;
  }

  async createCategory(data: ICreateCategoryBody): Promise<ICategoryDb> {
    return await this.categoryRepository.createCategory(data);
  }

  async updateCategory(
    id: number,
    data: IUpdateCategoryBody,
  ): Promise<ICategoryDb> {
    // Ensure it exists first
    await this.getCategoryById(id);

    const updatedCategory = await this.categoryRepository.updateCategory(
      id,
      data,
    );
    if (!updatedCategory) {
      throw new NotFound(`Category with ID ${id} not found.`);
    }
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    // Note: Due to Postgres ON DELETE RESTRICT / CASCADE behaviors established in the migration,
    // trying to delete a category that has active products/spec_items attached will trigger an SQL error.
    // A robust system might catch error '23503' (foreign_key_violation) in the repository to provide a cleaner message.
    const deleted = await this.categoryRepository.deleteCategory(id);
    if (!deleted) {
      throw new NotFound(
        `Category with ID ${id} not found or already deleted.`,
      );
    }
  }
}
