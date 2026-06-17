import { queryOptions } from "@tanstack/react-query";
import * as uomService from "./uom.service";

export const uomQueries = {
  all: () => ["uoms"],
  list: () =>
    queryOptions({
      queryKey: [...uomQueries.all(), "list"],
      queryFn: () => uomService.getAllUoms(),
      staleTime: 60_000 * 60, // UOMs rarely change
    }),
};
