import {
  type ColumnDef,
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
import { type ISpecItemOption } from "@/domains/project/project.types";
import { CheckCircle2 } from "lucide-react";

interface Props {
  data: ISpecItemOption[];
  onSetWinner: (productId: number) => void;
}

export const SourcingOptionsTable = ({ data, onSetWinner }: Props) => {
  const columns: ColumnDef<ISpecItemOption>[] = [
    { accessorKey: "product_name", header: "Product" },
    { accessorKey: "supplier_name", header: "Supplier" },
    { accessorKey: "unit_price", header: "Price" },
    { accessorKey: "lead_time_days", header: "Lead Time (Days)" },
    {
      id: "actions",
      header: "Action",
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
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
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
};
