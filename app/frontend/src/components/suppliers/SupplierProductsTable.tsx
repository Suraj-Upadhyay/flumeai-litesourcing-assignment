import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@packages/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@packages/ui/components/ui/table";

import { supplierQueries } from "@/domains/supplier/supplier.query";
import type { ISupplierProduct } from "@/domains/supplier/supplier.types";

const columnHelper = createColumnHelper<ISupplierProduct>();

const columns = [
  columnHelper.accessor("product_name", {
    header: "Product Name",
    cell: (info) => (
      <span className="font-medium text-slate-900">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("category_id", {
    header: "Category",
    cell: (info) => {
      const row = info.row.original;
      // Prefer the joined string name, fallback to the raw ID if not available
      return row.category_name || `Category ${info.getValue()}`;
    },
  }),
  columnHelper.accessor("unit_price", {
    header: "Unit Price",
    cell: (info) => {
      const price = info.getValue();
      const currency = info.row.original.currency;

      // Format as currency (fallback to basic string combination if Intl fails)
      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
        }).format(price);
      } catch {
        return `${price} ${currency}`;
      }
    },
  }),
  columnHelper.accessor("unit_of_measure_id", {
    header: "Unit",
    cell: (info) => {
      const row = info.row.original;
      return row.unit_of_measure_name || `Unit ${info.getValue()}`;
    },
  }),
  columnHelper.accessor("lead_time_days", {
    header: "Lead Time",
    cell: (info) => `${info.getValue()} days`,
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: () => (
      <Button variant="ghost" size="sm">
        Edit
      </Button>
    ),
  }),
];

export function SupplierProductsTable({ supplierId }: { supplierId: number }) {
  const { data, isLoading, isError } = useQuery(
    supplierQueries.products(supplierId)
  );

  // Safely extract the array in case the API wraps it in a { data: [] } object
  const tableData: ISupplierProduct[] = Array.isArray(data)
    ? data
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any)?.data || [];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="p-12 text-center text-sm text-slate-500">
        Loading product catalog...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 text-center text-sm text-red-500">
        Failed to load catalog.
      </div>
    );
  }

  if (tableData.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-500">
        <p>No products found in catalog.</p>
        <p className="text-sm mt-1">
          Click "+ Add Product" to build this catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader className="bg-slate-50 border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
