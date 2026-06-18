import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Card, CardContent } from "@packages/ui/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@packages/ui/components/ui/table";
import { Badge } from "@packages/ui/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { projectQueries } from "@/domains/project/project.query";
import type { IProject } from "@/domains/project/project.types";

const columnHelper = createColumnHelper<IProject>();

const columns = [
  columnHelper.accessor("project_name", {
    header: "Project Name",
    cell: (info) => (
      // Link to the project details page
      <Link
        to="/projects/$projectId"
        params={{ projectId: String(info.row.original.id) }}
        className="font-medium text-slate-900 hover:text-blue-600 hover:underline"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("client_name", {
    header: "Client",
    cell: (info) => (
      <span className="text-slate-600">{info.getValue() || "-"}</span>
    ),
  }),
  columnHelper.accessor("project_status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue();

      if (!status) return null;

      // Dynamic badge styling based on status
      const getBadgeVariant = (status: string) => {
        switch (status.toUpperCase()) {
          case "ACTIVE":
            return "bg-blue-50 text-blue-700 border-blue-200";
          case "COMPLETED":
            return "bg-green-50 text-green-700 border-green-200";
          default:
            return "bg-slate-100 text-slate-700 border-slate-200";
        }
      };

      return (
        <Badge variant="outline" className={getBadgeVariant(status)}>
          {status}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("created_at", {
    header: "Date Added",
    cell: (info) => {
      const dateVal = info.getValue();
      if (!dateVal) return <span className="text-slate-400">-</span>;

      // Basic date formatting
      const date = new Date(dateVal);
      return (
        <span className="text-slate-500">{date.toLocaleDateString()}</span>
      );
    },
  }),
];

export function ProjectsList() {
  // Fetch data using the query options you defined
  const { data: rawData, isLoading, isError } = useQuery(projectQueries.list());

  // 1. Memoize columns for TanStack Table stability
  const memoizedColumns = useMemo(() => columns, []);

  // 2. Safely extract the array. If the API returns an object with a nested array,
  // this ensures TanStack Table actually receives the array it needs.
  const tableData = useMemo(() => {
    console.log({ rawData });
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;

    // Fallbacks if your backend wraps the response (e.g., { data: [...] } or { items: [...] })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (rawData as any).data || (rawData as any).items || [];
  }, [rawData]);

  // 3. Initialize TanStack Table
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tableData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0 min-h-100 flex items-center justify-center text-slate-400 min-h-[400px]">
          Loading projects...
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-0 min-h-100 flex items-center justify-center text-red-500 min-h-[400px]">
          Failed to load projects. Please try again.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 font-semibold text-slate-600"
                  >
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-slate-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-slate-500"
                >
                  No projects found. Create one to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
