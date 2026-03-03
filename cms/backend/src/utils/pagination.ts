export class PaginationHelper {
  static parse(page: any = "1", limit: any = "10", maxLimit = 1000) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(maxLimit, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;
    return { pageNum, limitNum, skip };
  }

  static buildResponse(data: any[], total: number, pageNum: number, limitNum: number) {
    const totalPages = Math.ceil(total / limitNum);
    return {
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };
  }
}
