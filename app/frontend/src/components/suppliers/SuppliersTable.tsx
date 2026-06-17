import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { Button } from "@packages/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@packages/ui/components/ui/table";

// Adjust these imports to match your actual domain/service paths
import { supplierQueries } from "@/domains/supplier/supplier.query";
import type { ISupplier } from "@/domains/supplier/supplier.types";

const columnHelper = createColumnHelper<ISupplier>();

const columns = [
  columnHelper.accessor("name", {
    header: "Supplier",
    cell: (info) => (
      <span className="font-medium text-slate-900">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("country", {
    header: "Country",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("website", {
    header: "Website",
    cell: (info) => {
      const url = info.getValue();
      if (!url) return <span className="text-slate-400">-</span>;

      // Ensure the URL is clickable by appending https if missing
      const href = url.startsWith("http") ? url : `https://${url}`;
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {url}
        </a>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: (info) => (
      <Button variant="ghost" size="sm" asChild>
        <Link
          to="/suppliers/$supplierId"
          params={{
            supplierId: String(info.row.original.id),
          }}
        >
          View Details
        </Link>
      </Button>
    ),
  }),
];

export function SuppliersTable() {
  const { data, isLoading, isError } = useQuery(supplierQueries.list());

  // Safely extract the array in case the API wraps it in a { data: [] } object
  const tableData: ISupplier[] = Array.isArray(data)
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
        Loading suppliers directory...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 text-center text-sm text-red-500">
        Failed to load suppliers.
      </div>
    );
  }

  if (tableData.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-500">
        <p>No suppliers found.</p>
        <p className="text-sm mt-1">Click "+ Add Supplier" to get started.</p>
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
