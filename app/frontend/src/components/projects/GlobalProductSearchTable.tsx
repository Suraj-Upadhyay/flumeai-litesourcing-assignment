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
import { type IProductJoined } from "@/domains/product/product.types";

interface Props {
  data: IProductJoined[];
  onAttach: (productId: number) => void;
}

export const GlobalProductSearchTable = ({ data, onAttach }: Props) => {
  const columns: ColumnDef<IProductJoined>[] = [
    { accessorKey: "product_name", header: "Product" },
    { accessorKey: "supplier_name", header: "Supplier" },
    { accessorKey: "unit_price", header: "Price" },
    {
      id: "attach",
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
