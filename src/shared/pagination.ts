export class Pagination {
  constructor(page: number, pageSize: number) {
    this.page = page;
    this.pageSize = pageSize;
  }
  public page: number;
  public pageSize: number;
}
