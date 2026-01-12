import * as React from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  X,
  Loader2,
} from 'lucide-react';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Input } from './input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Alert, AlertDescription } from './alert';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';

/**
 * Parameters for fetching paginated data from the server
 */
export interface FetchParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

/**
 * Response structure for paginated data
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Props for the ServerPaginatedTable component
 */
export interface ServerPaginatedTableProps<TData> {
  /** Column definitions for the table */
  columns: ColumnDef<TData, unknown>[];
  /** Function to fetch data from the server */
  fetchData: (params: FetchParams) => Promise<PaginatedResponse<TData>>;
  /** Title displayed in the card header */
  title: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Default page size */
  defaultPageSize?: number;
  /** Callback when create button is clicked */
  onCreateClick?: () => void;
  /** Label for the create button */
  createButtonLabel?: string;
  /** Callback when a row is deleted - reserved for future use */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRowDelete?: (row: TData) => Promise<void>;
  /** Message shown when table is empty */
  emptyStateMessage?: string;
  /** Message shown when search returns no results */
  noResultsMessage?: string;
  /** External error message to display */
  error?: string | null;
  /** External success message to display */
  successMessage?: string | null;
  /** Key to trigger data refresh */
  refreshKey?: number;
}


/**
 * ServerPaginatedTable Component
 * 
 * A data table component that supports server-side pagination, search, and sorting.
 * 
 * Requirements:
 * - 5.1: Request data from server with page number and page size parameters
 * - 5.2: Display total count and current page information
 * - 5.3: Provide controls to navigate between pages (first, previous, next, last)
 * - 5.4: Allow users to select number of items per page (10, 25, 50, 100)
 * - 5.5: Show loading indicator while fetching new data
 * - 5.6: Maintain current page when performing actions like delete
 * - 5.7: Navigate to previous page when current page becomes empty after deletion
 * - 6.1: Debounce search input by 300ms
 * - 6.2: Send search queries to server for server-side filtering
 * - 6.3: Reset to page 1 when search results are returned
 * - 6.4: Display "no results" message when search returns empty
 * - 6.5: Provide clear button to reset search and filters
 * - 8.3: Enable keyboard navigation through table rows
 */
export function ServerPaginatedTable<TData>({
  columns,
  fetchData,
  title,
  searchPlaceholder = 'Search...',
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  onCreateClick,
  createButtonLabel = 'Create New',
  onRowDelete: _onRowDelete,
  emptyStateMessage = 'No data available.',
  noResultsMessage = 'No results found for your search.',
  error: externalError = null,
  successMessage = null,
  refreshKey = 0,
}: ServerPaginatedTableProps<TData>) {
  // State
  const [data, setData] = React.useState<TData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchValue, setSearchValue] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [focusedRowIndex, setFocusedRowIndex] = React.useState<number>(-1);

  // Debounced search value (300ms delay per Requirement 6.1)
  const debouncedSearch = useDebounce(searchValue, 300);

  // Pagination hook
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: defaultPageSize,
    pageSizeOptions,
  });

  // Table ref for keyboard navigation
  const tableRef = React.useRef<HTMLTableElement>(null);

  // Fetch data from server
  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: FetchParams = {
        page: pagination.state.page,
        pageSize: pagination.state.pageSize,
      };

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      if (sorting.length > 0) {
        params.sortBy = sorting[0].id;
        params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
      }

      const response = await fetchData(params);
      setData(response.data);
      pagination.setTotal(response.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, pagination.state.page, pagination.state.pageSize, debouncedSearch, sorting, pagination.setTotal]);

  // Load data when dependencies change
  React.useEffect(() => {
    loadData();
  }, [loadData, refreshKey]);

  // Reset to page 1 when search changes (Requirement 6.3)
  React.useEffect(() => {
    if (debouncedSearch !== '') {
      pagination.goToFirst();
    }
  }, [debouncedSearch]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // Clear search (Requirement 6.5)
  const handleClearSearch = () => {
    setSearchValue('');
    pagination.goToFirst();
  };

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    pagination.setPageSize(Number(e.target.value));
  };

  // React Table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualFiltering: true,
    state: {
      sorting,
    },
  });

  // Keyboard navigation handler (Requirement 8.3)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
    const rows = table.getRowModel().rows;
    if (rows.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedRowIndex((prev) => Math.min(prev + 1, rows.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedRowIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setFocusedRowIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedRowIndex(rows.length - 1);
        break;
      case 'Enter':
      case ' ':
        if (focusedRowIndex >= 0 && focusedRowIndex < rows.length) {
          // Allow row selection or action
          e.preventDefault();
        }
        break;
    }
  };

  // Focus management for keyboard navigation
  React.useEffect(() => {
    if (focusedRowIndex >= 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      if (rows[focusedRowIndex]) {
        (rows[focusedRowIndex] as HTMLElement).focus();
      }
    }
  }, [focusedRowIndex]);

  // Determine if we're showing search results with no matches
  const isSearchActive = debouncedSearch.length > 0;
  const hasNoResults = data.length === 0 && !isLoading && isSearchActive;
  const isEmpty = data.length === 0 && !isLoading && !isSearchActive;

  // Calculate display range
  const startItem = data.length > 0 ? (pagination.state.page - 1) * pagination.state.pageSize + 1 : 0;
  const endItem = Math.min(pagination.state.page * pagination.state.pageSize, pagination.state.total);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {onCreateClick && (
            <Button onClick={onCreateClick} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {createButtonLabel}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Input */}
        <div className="flex items-center py-4 gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              className="pl-8 pr-8"
              aria-label="Search table"
            />
            {searchValue && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Alerts */}
        {(error || externalError) && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error || externalError}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Table */}
        <div className="rounded-md border">
          <Table ref={tableRef} onKeyDown={handleKeyDown} tabIndex={0} role="grid" aria-label={title}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} role="row">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} role="columnheader">
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            'flex items-center space-x-2',
                            header.column.getCanSort() && 'cursor-pointer select-none'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                          role={header.column.getCanSort() ? 'button' : undefined}
                          aria-sort={
                            header.column.getIsSorted()
                              ? header.column.getIsSorted() === 'asc'
                                ? 'ascending'
                                : 'descending'
                              : undefined
                          }
                        >
                          <span>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {header.column.getCanSort() && (
                            <div className="flex flex-col">
                              <ChevronUp
                                className={cn(
                                  'h-3 w-3',
                                  header.column.getIsSorted() === 'asc'
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                                )}
                              />
                              <ChevronDown
                                className={cn(
                                  'h-3 w-3 -mt-1',
                                  header.column.getIsSorted() === 'desc'
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                                )}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex items-center justify-center" role="status" aria-label="Loading data">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : hasNoResults ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-muted-foreground">{noResultsMessage}</span>
                      <Button variant="outline" size="sm" onClick={handleClearSearch}>
                        Clear search
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : isEmpty ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <span className="text-muted-foreground">{emptyStateMessage}</span>
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    tabIndex={0}
                    role="row"
                    aria-rowindex={index + 1}
                    className={cn(
                      focusedRowIndex === index && 'ring-2 ring-primary ring-inset'
                    )}
                    onFocus={() => setFocusedRowIndex(index)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} role="gridcell">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {pagination.state.total > 0 ? (
                <>
                  Showing {startItem} to {endItem} of {pagination.state.total} entries
                </>
              ) : (
                'No entries'
              )}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="page-size" className="text-sm text-muted-foreground">
                Rows per page:
              </label>
              <select
                id="page-size"
                value={pagination.state.pageSize}
                onChange={handlePageSizeChange}
                className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                aria-label="Select number of rows per page"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Page {pagination.state.page} of {pagination.state.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={pagination.goToFirst}
              disabled={!pagination.canGoPrevious || isLoading}
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={pagination.goToPrevious}
              disabled={!pagination.canGoPrevious || isLoading}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={pagination.goToNext}
              disabled={!pagination.canGoNext || isLoading}
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={pagination.goToLast}
              disabled={!pagination.canGoNext || isLoading}
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ServerPaginatedTable;
