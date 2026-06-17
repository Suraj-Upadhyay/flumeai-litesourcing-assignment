import { queryClient } from "@utility/queryClient";
import * as uomService from "./uom.service";
import type { IUom } from "./uom.types";

export const getAllUomsQuery = async (): Promise<IUom[]> => {
  return await queryClient.fetchQuery({
    queryKey: ["getAllUoms"],
    queryFn: () => uomService.getAllUoms(),
    staleTime: 60_000 * 60, // UOMs rarely change
  });
};
