"use client";

import { MouseEvent, useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import qs from "query-string";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // searchKey: string;
  pageCount: number;
  pageIndex: number;
  pageSize?: number;
  page?: number;
  nextPage: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  // searchKey,
  page = 1,
  pageCount,
  pageIndex: pIdx,
  nextPage,
  pageSize: limit = 10,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'volume24h', desc: true }]);


  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page;
  const fallbackPerPage = isNaN(limit) ? 5 : limit;

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: fallbackPage < nextPage ? nextPage : fallbackPage,
    pageSize: fallbackPerPage,
  });

  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize]
  );


  // useEffect(() => {
  //   const url = qs.stringifyUrl(
  //     {
  //       url: pathname,
  //       query: {
  //         page: pageIndex,
  //         limit: pageSize,
  //       },
  //     },
  //     { skipEmptyString: true, skipNull: true }
  //   );
  //   router.push(url);
  // }, [pageIndex, pageSize]);

  // const setPagination: any = () => {
  //   const url = qs.stringifyUrl(
  //     {
  //       url: pathname,
  //       query: {
  //         page: nextPage,
  //         limit: pageSize,
  //       },
  //     },
  //     { skipEmptyString: true, skipNull: true }
  //   );

  //   return router.push(url);
  // };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: pageCount ?? -1,
    onPaginationChange: setPagination,
    // autoResetPageIndex: true,
    onSortingChange: setSorting,
    autoResetAll: true,
    state: {
      globalFilter: columnFilters,
      pagination,
      sorting
    },
  });

  // const handleNextOrPrev = (e: MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation();
  //   const url = qs.stringifyUrl(
  //     {
  //       url: pathname,
  //       query: {
  //         page: nextPage,
  //       },
  //     },
  //     { skipEmptyString: true, skipNull: true }
  //   );

  //   router.push(url);
  // };

  return (
    <div>
      {/* <div className="relative flex items-center py-4">
        <button className="absolute top-1/3 left-4 h-[24px] w-[24px] text-primary-300 dark:text-primary  transition rounded-full p-1 flex items-center justify-center">
          <Search className="dark:text-primary" />
        </button>
        <Input
          placeholder="Search here"
          className="w-full px-14 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 lg:max-w-sm"
          value={columnFilters ?? ""}
          onChange={(event) =>
            setColumnFilters(event.target.value)
          }
          // className="max-w-sm"
        />
      </div> */}
      <div className="rounded-md bg-card">
        <Table >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
