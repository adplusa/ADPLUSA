import { useState, useCallback, useMemo } from 'react';

/**
 * Pagination state interface
 */
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Options for configuring the usePagination hook
 */
export interface UsePaginationOptions {
  /** Initial page number (1-indexed). Default: 1 */
  initialPage?: number;
  /** Initial page size. Default: 10 */
  initialPageSize?: number;
  /** Available page size options. Default: [10, 25, 50, 100] */
  pageSizeOptions?: number[];
  /** Total number of items (can be updated via setTotal) */
  initialTotal?: number;
}

/**
 * Return type for the usePagination hook
 */
export interface UsePaginationReturn {
  /** Current pagination state */
  state: PaginationState;
  /** Available page size options */
  pageSizeOptions: number[];
  /** Navigate to a specific page */
  goToPage: (page: number) => void;
  /** Navigate to the first page */
  goToFirst: () => void;
  /** Navigate to the previous page */
  goToPrevious: () => void;
  /** Navigate to the next page */
  goToNext: () => void;
  /** Navigate to the last page */
  goToLast: () => void;
  /** Change the page size (resets to page 1) */
  setPageSize: (size: number) => void;
  /** Update the total count (recalculates totalPages) */
  setTotal: (total: number) => void;
  /** Handle page calculation after deletion */
  handleDeletion: (deletedCount?: number) => void;
  /** Check if can go to previous page */
  canGoPrevious: boolean;
  /** Check if can go to next page */
  canGoNext: boolean;
  /** Get fetch parameters for API calls */
  getFetchParams: () => { page: number; pageSize: number };
}

/**
 * Calculate the total number of pages based on total items and page size
 */
export function calculateTotalPages(total: number, pageSize: number): number {
  if (total <= 0 || pageSize <= 0) return 1;
  return Math.ceil(total / pageSize);
}

/**
 * Calculate the correct page after deletion
 * If current page becomes empty after deletion, navigate to previous page
 * Unless we're already on page 1
 * 
 * Requirements: 5.6, 5.7
 */
export function calculatePageAfterDeletion(
  currentPage: number,
  currentTotal: number,
  pageSize: number,
  deletedCount: number = 1
): number {
  const newTotal = Math.max(0, currentTotal - deletedCount);
  const newTotalPages = calculateTotalPages(newTotal, pageSize);
  
  // If current page is now beyond total pages, go to last valid page
  if (currentPage > newTotalPages) {
    return Math.max(1, newTotalPages);
  }
  
  // Check if current page would be empty after deletion
  const itemsOnCurrentPage = currentTotal - (currentPage - 1) * pageSize;
  const remainingOnCurrentPage = itemsOnCurrentPage - deletedCount;
  
  // If current page becomes empty and we're not on page 1, go to previous page
  if (remainingOnCurrentPage <= 0 && currentPage > 1) {
    return currentPage - 1;
  }
  
  return currentPage;
}

/**
 * Custom hook for managing pagination state
 * 
 * Implements:
 * - Page state management (Requirements: 5.1, 5.2)
 * - Page size selection (Requirements: 5.4)
 * - Page calculation after deletion (Requirements: 5.6, 5.7)
 * 
 * @param options - Configuration options for pagination
 * @returns Pagination state and control functions
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const {
    initialPage = 1,
    initialPageSize = 10,
    pageSizeOptions = [10, 25, 50, 100],
    initialTotal = 0,
  } = options;

  const [page, setPage] = useState(Math.max(1, initialPage));
  const [pageSize, setPageSizeState] = useState(
    pageSizeOptions.includes(initialPageSize) ? initialPageSize : pageSizeOptions[0]
  );
  const [total, setTotalState] = useState(Math.max(0, initialTotal));

  // Calculate total pages
  const totalPages = useMemo(
    () => calculateTotalPages(total, pageSize),
    [total, pageSize]
  );

  // Navigation checks
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  // Navigate to a specific page (1-indexed)
  const goToPage = useCallback((newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages || 1));
    setPage(validPage);
  }, [totalPages]);

  // Navigate to first page
  const goToFirst = useCallback(() => {
    setPage(1);
  }, []);

  // Navigate to previous page
  const goToPrevious = useCallback(() => {
    setPage(prev => Math.max(1, prev - 1));
  }, []);

  // Navigate to next page
  const goToNext = useCallback(() => {
    setPage(prev => Math.min(totalPages || 1, prev + 1));
  }, [totalPages]);

  // Navigate to last page
  const goToLast = useCallback(() => {
    setPage(totalPages || 1);
  }, [totalPages]);

  // Change page size (resets to page 1 per Requirements 5.4)
  const setPageSize = useCallback((newSize: number) => {
    if (pageSizeOptions.includes(newSize)) {
      setPageSizeState(newSize);
      setPage(1); // Reset to page 1 when page size changes
    }
  }, [pageSizeOptions]);

  // Update total count
  const setTotal = useCallback((newTotal: number) => {
    const validTotal = Math.max(0, newTotal);
    setTotalState(validTotal);
    
    // Adjust current page if it's now beyond total pages
    const newTotalPages = calculateTotalPages(validTotal, pageSize);
    setPage(prev => Math.min(prev, Math.max(1, newTotalPages)));
  }, [pageSize]);

  // Handle deletion - adjusts page if current page becomes empty
  // Requirements: 5.6, 5.7
  const handleDeletion = useCallback((deletedCount: number = 1) => {
    const newPage = calculatePageAfterDeletion(page, total, pageSize, deletedCount);
    const newTotal = Math.max(0, total - deletedCount);
    
    setTotalState(newTotal);
    setPage(newPage);
  }, [page, total, pageSize]);

  // Get fetch parameters for API calls
  const getFetchParams = useCallback(() => ({
    page,
    pageSize,
  }), [page, pageSize]);

  // Build state object
  const state: PaginationState = useMemo(() => ({
    page,
    pageSize,
    total,
    totalPages,
  }), [page, pageSize, total, totalPages]);

  return {
    state,
    pageSizeOptions,
    goToPage,
    goToFirst,
    goToPrevious,
    goToNext,
    goToLast,
    setPageSize,
    setTotal,
    handleDeletion,
    canGoPrevious,
    canGoNext,
    getFetchParams,
  };
}

export default usePagination;
