import { queryOptions } from "@tanstack/react-query";
import * as countryService from "./country.service";

export const countryQueries = {
  all: () => ["countries"],
  list: () =>
    queryOptions({
      queryKey: [...countryQueries.all(), "list"],
      queryFn: () => countryService.getAllCountries(),
      staleTime: 60_000 * 60, // Countries rarely change
    }),
};
