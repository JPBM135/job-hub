export interface PageInfo {
  count: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Paginated<T> {
  data: T[];
  pageInfo: PageInfo;
}
