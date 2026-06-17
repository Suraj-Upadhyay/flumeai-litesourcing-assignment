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
import { categoryQueries } from "@/domains/category/category.query"; // Fixed Import
import { supplierQueries } from "@/domains/supplier/supplier.query"; // Fixed Import
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

export const GlobalCatalogPane = ({
  searchQuery,
  category,
  supplier,
}: {
  searchQuery: string;
  category: string;
  supplier: string;
}) => {
  const { projectId, specItemId } = routeApi.useParams();
  const navigate = useNavigate({ from: routeApi.useMatch().fullPath });

  const selectedCategoryIds = category ? category.split(",") : undefined;
  const selectedSupplierIds = supplier ? supplier.split(",") : undefined;
  const categoryIds = selectedCategoryIds
    ? selectedCategoryIds.map(Number)
    : undefined;
  const supplierIds = selectedSupplierIds
    ? selectedSupplierIds.map(Number)
    : undefined;

  // 1. Fetch data for table
  const { data: products = [] } = useQuery(
    productQueries.list({
      query: searchQuery,
      category_ids: categoryIds,
      supplier_ids: supplierIds,
      limit: 20,
      offset: 0,
    })
  );

  // 2. Fetch options for dropdowns
  const { data: categories = [] } = useQuery(categoryQueries.list());
  const { data: suppliers = [] } = useQuery(supplierQueries.list());

  const { mutate: attachOption } = useAttachSourcingOption();

  const handleFilterChange = (
    key: "category_ids" | "supplier_ids",
    values: string[]
  ) => {
    navigate({
      search: (prev) => ({
        ...prev,
        [key]: values.length ? values.join(",") : undefined,
      }),
    });
  };

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Search Global Catalog</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) =>
            navigate({ search: (prev) => ({ ...prev, q: e.target.value }) })
          }
        />
        <GlobalProductSearchTable
          data={products}
          categories={categories.map((c) => ({
            label: c.name,
            value: String(c.id),
          }))}
          suppliers={suppliers.map((s) => ({
            label: s.name,
            value: String(s.id),
          }))}
          onAttach={(productId) =>
            attachOption({
              projectId: Number(projectId),
              specItemId: Number(specItemId),
              payload: { product_id: productId },
            })
          }
          selectedSupplierIds={selectedSupplierIds}
          selectedCategoryIds={selectedCategoryIds}
          onCategoryChange={(vals) => handleFilterChange("category_ids", vals)}
          onSupplierChange={(vals) => handleFilterChange("supplier_ids", vals)}
        />
      </CardContent>
    </Card>
  );
};
