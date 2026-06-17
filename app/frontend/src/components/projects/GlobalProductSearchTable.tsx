import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
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
import { type IProductJoined } from "@/domains/product/product.types";
import { MultiSelect } from "./MutliSelect";

interface Props {
  data: IProductJoined[];
  onAttach: (productId: number) => void;
  categories: { label: string; value: string }[];
  suppliers: { label: string; value: string }[];
  selectedCategoryIds?: string[];
  selectedSupplierIds?: string[];
  onCategoryChange: (values: string[]) => void;
  onSupplierChange: (values: string[]) => void;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
}

export const GlobalProductSearchTable = ({
  data,
  onAttach,
  categories,
  suppliers,
  selectedCategoryIds,
  selectedSupplierIds,
  onCategoryChange,
  onSupplierChange,
  limit,
  offset,
  onPageChange,
}: Props) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<IProductJoined>[] = [
    { accessorKey: "product_name", header: "Product" },
    { accessorKey: "supplier_name", header: "Supplier" },
    { accessorKey: "category_name", header: "Category" },
    { accessorKey: "unit_price", header: "Price", sortingFn: "alphanumeric" },
    {
      id: "attach",
      header: "Action",
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onAttach(row.original.id)}
        >
          Attach
        </Button>
      ),
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    // Parent container is a flex column that fills the space
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <div className="flex gap-4">
        <MultiSelect
          label="Filter Categories"
          options={categories}
          selected={selectedCategoryIds ?? []}
          onChange={onCategoryChange}
        />
        <MultiSelect
          label="Filter Suppliers"
          options={suppliers}
          selected={selectedSupplierIds ?? []}
          onChange={onSupplierChange}
        />
      </div>

      {/* This container has flex-1 and min-h-0 to take remaining space, and overflow-auto for internal scrolling */}
      <div className="rounded-md border flex-1 min-h-0 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    className={
                      h.column.getCanSort() ? "cursor-pointer select-none" : ""
                    }
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {{ asc: " 🔼", desc: " 🔽" }[
                      h.column.getIsSorted() as string
                    ] ?? null}
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

      {/* Pagination is now outside the scrollable area, so it stays fixed at the bottom */}
      <div className="flex items-center justify-end space-x-2 pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(0, offset - limit))}
          disabled={offset === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(offset + limit)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
