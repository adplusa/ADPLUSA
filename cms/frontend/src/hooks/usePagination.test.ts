import { describe, it, expect } from 'vitest';
import { 
  calculateTotalPages, 
  calculatePageAfterDeletion 
} from './usePagination';

describe('calculateTotalPages', () => {
  it('calculates correct total pages', () => {
    expect(calculateTotalPages(100, 10)).toBe(10);
    expect(calculateTotalPages(101, 10)).toBe(11);
    expect(calculateTotalPages(99, 10)).toBe(10);
    expect(calculateTotalPages(0, 10)).toBe(1);
    expect(calculateTotalPages(5, 10)).toBe(1);
  });

  it('handles edge cases', () => {
    expect(calculateTotalPages(0, 0)).toBe(1);
    expect(calculateTotalPages(-1, 10)).toBe(1);
    expect(calculateTotalPages(10, -1)).toBe(1);
  });

  it('handles various page sizes', () => {
    expect(calculateTotalPages(100, 25)).toBe(4);
    expect(calculateTotalPages(100, 50)).toBe(2);
    expect(calculateTotalPages(100, 100)).toBe(1);
    expect(calculateTotalPages(101, 100)).toBe(2);
  });
});

describe('calculatePageAfterDeletion', () => {
  it('stays on current page when items remain', () => {
    // Page 1 with 25 items, delete 1 -> stay on page 1
    expect(calculatePageAfterDeletion(1, 25, 10, 1)).toBe(1);
    // Page 2 with 25 items, delete 1 -> stay on page 2
    expect(calculatePageAfterDeletion(2, 25, 10, 1)).toBe(2);
  });

  it('goes to previous page when current page becomes empty', () => {
    // Page 3 with 21 items (10+10+1), delete 1 -> page 2
    expect(calculatePageAfterDeletion(3, 21, 10, 1)).toBe(2);
    // Page 2 with 11 items (10+1), delete 1 -> page 1
    expect(calculatePageAfterDeletion(2, 11, 10, 1)).toBe(1);
  });

  it('stays on page 1 even when empty', () => {
    // Page 1 with 1 item, delete 1 -> stay on page 1
    expect(calculatePageAfterDeletion(1, 1, 10, 1)).toBe(1);
    // Page 1 with 0 items -> stay on page 1
    expect(calculatePageAfterDeletion(1, 0, 10, 1)).toBe(1);
  });

  it('handles multiple deletions', () => {
    // Page 3 with 25 items, delete 5 -> page 2 (20 items left, 2 pages)
    expect(calculatePageAfterDeletion(3, 25, 10, 5)).toBe(2);
    // Page 3 with 30 items, delete 10 -> page 2 (20 items left, 2 pages)
    expect(calculatePageAfterDeletion(3, 30, 10, 10)).toBe(2);
  });

  it('handles deletion that empties multiple pages', () => {
    // Page 5 with 50 items, delete 40 -> page 1 (10 items left, 1 page)
    expect(calculatePageAfterDeletion(5, 50, 10, 40)).toBe(1);
  });

  it('handles different page sizes', () => {
    // Page 2 with 26 items at pageSize 25, delete 1 -> page 1
    expect(calculatePageAfterDeletion(2, 26, 25, 1)).toBe(1);
    // Page 2 with 51 items at pageSize 50, delete 1 -> page 1
    expect(calculatePageAfterDeletion(2, 51, 50, 1)).toBe(1);
  });

  it('stays on current page when not the last item on page', () => {
    // Page 2 with 15 items (10+5), delete 1 -> stay on page 2 (still has 4 items)
    expect(calculatePageAfterDeletion(2, 15, 10, 1)).toBe(2);
    // Page 3 with 25 items (10+10+5), delete 2 -> stay on page 3 (still has 3 items)
    expect(calculatePageAfterDeletion(3, 25, 10, 2)).toBe(3);
  });
});
