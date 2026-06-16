import { AbstractClass, Primary } from "@/di/injector";
import { CountryRepositoryInterface } from "./country.repository";
import type { ICountryDb } from "./country.schema";

@AbstractClass()
export abstract class CountryServiceInterface {
  abstract getCountries(): Promise<ICountryDb[]>;
}

@Primary
export class CountryServicePrimary extends CountryServiceInterface {
  constructor(private countryRepository: CountryRepositoryInterface) {
    super();
  }
  async getCountries(): Promise<ICountryDb[]> {
    return await this.countryRepository.getAllCountries();
  }
}
