import { AbstractClass, Primary } from "@/di/injector";
import { SourcingRepositoryInterface } from "./supplier.repository";
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
import { NotFound } from "@/utility";

@AbstractClass()
export abstract class SourcingServiceInterface {
  abstract getSuppliers(
    filters: IGetSupplierFilterQuery,
  ): Promise<ISupplierFilterResult[]>;
  abstract getSupplierById(id: number): Promise<ISupplierFilterResult>;
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
  ): Promise<ISupplierFilterResult>;
  abstract deleteSupplier(id: number): Promise<void>;
  abstract createSupplierProduct(
    supplierId: number,
    data: ICreateProductBody,
  ): Promise<IProductFilterResult>;
  abstract updateSupplierProduct(
    supplierId: number,
    productId: number,
    data: IUpdateProductBody,
  ): Promise<any>;
  abstract deleteSupplierProduct(
    supplierId: number,
    productId: number,
  ): Promise<void>;
}

@Primary
export class SourcingServicePrimary extends SourcingServiceInterface {
  constructor(private sourcingRepository: SourcingRepositoryInterface) {
    super();
  }

  async getSuppliers(
    filters: IGetSupplierFilterQuery,
  ): Promise<ISupplierFilterResult[]> {
    return await this.sourcingRepository.getFilteredSuppliers(filters);
  }

  async getSupplierById(id: number): Promise<ISupplierFilterResult> {
    const supplier = await this.sourcingRepository.getSupplierById(id);
    if (!supplier) throw new NotFound(`Supplier with ID ${id} not found.`);
    return supplier;
  }

  async getSupplierProducts(
    supplierId: number,
    filters: IGetProductFilterQuery,
  ): Promise<IProductFilterResult[]> {
    // Ensure supplier exists before fetching products
    await this.getSupplierById(supplierId);
    return await this.sourcingRepository.getSupplierProducts(
      supplierId,
      filters,
    );
  }

  async createSupplier(
    data: ICreateSupplierBody,
  ): Promise<ISupplierFilterResult> {
    return await this.sourcingRepository.createSupplier(data);
  }

  async updateSupplier(
    id: number,
    data: IUpdateSupplierBody,
  ): Promise<ISupplierFilterResult> {
    const supplier = await this.sourcingRepository.updateSupplier(id, data);
    if (!supplier) throw new NotFound(`Supplier with ID ${id} not found.`);
    return supplier;
  }

  async deleteSupplier(id: number): Promise<void> {
    const deleted = await this.sourcingRepository.deleteSupplier(id);
    if (!deleted)
      throw new NotFound(
        `Supplier with ID ${id} not found or already deleted.`,
      );
  }

  async createSupplierProduct(
    supplierId: number,
    data: ICreateProductBody,
  ): Promise<IProductFilterResult> {
    // Ensure supplier exists
    await this.getSupplierById(supplierId);
    return await this.sourcingRepository.createSupplierProduct(
      supplierId,
      data,
    );
  }

  async updateSupplierProduct(
    supplierId: number,
    productId: number,
    data: IUpdateProductBody,
  ) {
    // Verifying supplier exists first is good practice
    await this.getSupplierById(supplierId);

    const updatedProduct = await this.sourcingRepository.updateSupplierProduct(
      supplierId,
      productId,
      data,
    );
    if (!updatedProduct) {
      throw new NotFound(
        `Product ${productId} not found for this supplier, or no changes provided.`,
      );
    }
    return updatedProduct;
  }

  async deleteSupplierProduct(
    supplierId: number,
    productId: number,
  ): Promise<void> {
    await this.getSupplierById(supplierId);
    const deleted = await this.sourcingRepository.deleteSupplierProduct(
      supplierId,
      productId,
    );
    if (!deleted) {
      throw new NotFound(`Product ${productId} not found for this supplier.`);
    }
  }
}
