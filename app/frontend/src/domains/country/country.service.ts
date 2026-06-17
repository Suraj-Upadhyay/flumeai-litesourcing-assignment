import { axiosInstance } from "@utility/api";
import type { ICountry } from "./country.types";

export const getAllCountries = async () => {
  const response = await axiosInstance.get<ICountry[]>("/country/country");
  return response.data;
};
