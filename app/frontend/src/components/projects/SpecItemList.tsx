import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { projectQueries } from "@/domains/project/project.query";
import type { ISpecItem } from "@/domains/project/project.types";
import { Button } from "@packages/ui/components/ui/button";

// Assuming you have Shadcn UI table components available:
// If not, standard HTML <table> tags with Tailwind work perfectly too!
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@packages/ui/components/ui/table";

const columnHelper = createColumnHelper<ISpecItem>();

const columns = [
  columnHelper.accessor("name", {
    header: "Item Name",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("category_id", {
    header: "Category",
    // Note: If you want to show the category name, you'd typically join that on the backend
    // or pass a category map here. For now, we render the ID.
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("unit_of_measure_id", {
    header: "Unit",
    // Similarly, this renders the UoM ID.
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: (info) => (
      <Button variant="ghost" size="sm" asChild>
        <Link
          to="/projects/$projectId/spec-items/$specItemId"
          params={{
            projectId: String(info.row.original.project_id),
            specItemId: String(info.row.original.id),
          }}
        >
          View Options
        </Link>
      </Button>
    ),
  }),
];

export function SpecItemsTable({ projectId }: { projectId: number }) {
  const { data, isLoading, isError } = useQuery(
    projectQueries.specItems(projectId)
  );

  // Safely extract the array if your API wraps it in a { data: [] } object
  const tableData: ISpecItem[] = Array.isArray(data)
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
      <div className="p-8 text-center text-slate-500">
        Loading spec items...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load spec items.
      </div>
    );
  }

  if (tableData.length === 0) {
    return (
      <div className="min-h-50 flex flex-col items-center justify-center text-slate-500 bg-slate-50/50 rounded-md border border-dashed">
        <p>No spec items found.</p>
        <p className="text-sm">Click "Add Spec Item" to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-slate-50">
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
