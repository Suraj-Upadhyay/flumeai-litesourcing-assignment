import { AbstractClass, Primary } from "@/di/injector";
import { ProductRepositoryInterface } from "./product.repository";
import type {
  IGetProductFilterQuery,
  IProductJoinedDb,
} from "./product.schema";

@AbstractClass()
export abstract class ProductServiceInterface {
  abstract getProducts(
    filters: IGetProductFilterQuery,
  ): Promise<IProductJoinedDb[]>;
}

@Primary
export class ProductServicePrimary extends ProductServiceInterface {
  constructor(private productRepository: ProductRepositoryInterface) {
    super();
  }

  async getProducts(
    filters: IGetProductFilterQuery,
  ): Promise<IProductJoinedDb[]> {
    return await this.productRepository.getGlobalProducts(filters);
  }
}
