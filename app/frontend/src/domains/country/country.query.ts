import { queryClient } from "@utility/queryClient";
import * as countryService from "./country.service";
import type { ICountry } from "./country.types";

export const getAllCountriesQuery = async (): Promise<ICountry[]> => {
  return await queryClient.fetchQuery({
    queryKey: ["getAllCountries"],
    queryFn: () => countryService.getAllCountries(),
    staleTime: 60_000 * 60, // Countries rarely change, cache for longer
  });
};
