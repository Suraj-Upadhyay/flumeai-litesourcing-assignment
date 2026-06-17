import { useQuery } from "@tanstack/react-query";
import { Input } from "@packages/ui/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@packages/ui/components/ui/card";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import {
  projectQueries,
  useAttachSourcingOption,
  useSetWinningOption,
} from "@/domains/project/project.query";
import { productQueries } from "@/domains/product/product.query"; // Fixed Import
import { SourcingOptionsTable } from "./SourcingOptionsTable";
import { GlobalProductSearchTable } from "./GlobalProductSearchTable";

const routeApi = getRouteApi("/projects/$projectId/spec-items/$specItemId");

export const AttachedOptionsPane = () => {
  const { projectId, specItemId } = routeApi.useParams();
  const { data: options = [] } = useQuery(
    projectQueries.sourcingOptions(Number(projectId), Number(specItemId))
  );
  const { mutate: setWinner } = useSetWinningOption();

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Attached Sourcing Options</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <SourcingOptionsTable
          data={options}
          onSetWinner={(productId) =>
            setWinner({
              projectId: Number(projectId),
              specItemId: Number(specItemId),
              productId,
            })
          }
        />
      </CardContent>
    </Card>
  );
};

export const GlobalCatalogPane = ({ searchQuery }: { searchQuery: string }) => {
  const { projectId, specItemId } = routeApi.useParams();
  const navigate = useNavigate({ from: routeApi.useMatch().fullPath });

  // Fetch results based on the search query from URL using product queries
  const { data: products = [] } = useQuery(
    productQueries.list({ query: searchQuery, limit: 20, offset: 0 })
  );
  const { mutate: attachOption } = useAttachSourcingOption();

  const handleSearchChange = (value: string) => {
    // Sync search input to URL query parameter
    navigate({ search: (prev) => ({ ...prev, q: value }) });
  };

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Search Global Catalog</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <Input
          placeholder="Search products by name..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <div className="flex-1 overflow-auto">
          <GlobalProductSearchTable
            data={products}
            onAttach={(productId) =>
              attachOption({
                projectId: Number(projectId),
                specItemId: Number(specItemId),
                payload: { product_id: productId },
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};
