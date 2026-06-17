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
import { type ISpecItemOption } from "@/domains/project/project.types";
import { CheckCircle2 } from "lucide-react";

interface Props {
  data: ISpecItemOption[];
  onSetWinner: (productId: number) => void;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
}

export const SourcingOptionsTable = ({
  data,
  onSetWinner,
  limit,
  offset,
  onPageChange,
}: Props) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<ISpecItemOption>[] = [
    { accessorKey: "product_name", header: "Product" },
    { accessorKey: "supplier_name", header: "Supplier" },
    {
      accessorKey: "unit_price",
      header: "Price",
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "lead_time_days",
      header: "Lead Time (Days)",
    },
    {
      id: "actions",
      header: "Action",
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          variant={row.original.is_winning ? "default" : "outline"}
          size="sm"
          onClick={() => onSetWinner(row.original.product_id)}
          className={
            row.original.is_winning ? "bg-green-600 hover:bg-green-700" : ""
          }
        >
          {row.original.is_winning ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Winner
            </>
          ) : (
            "Set Winner"
          )}
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
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
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
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[h.column.getIsSorted() as string] ?? null}
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

      <div className="flex items-center justify-end space-x-2">
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
