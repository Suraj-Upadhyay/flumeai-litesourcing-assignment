import { AbstractClass, Primary } from "@/di/injector";
import { UomRepositoryInterface } from "./uom.repository";
import type { IUomDb } from "./uom.schema";

@AbstractClass()
export abstract class UomServiceInterface {
  abstract getUoms(): Promise<IUomDb[]>;
}

@Primary
export class UomServicePrimary extends UomServiceInterface {
  constructor(private uomRepository: UomRepositoryInterface) {
    super();
  }
  async getUoms(): Promise<IUomDb[]> {
    return await this.uomRepository.getAllUoms();
  }
}
