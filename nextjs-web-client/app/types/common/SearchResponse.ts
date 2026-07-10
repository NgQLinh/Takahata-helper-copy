export type SearchResponse<T> = {
  page: number;
  pageSize: number;
  totalItems: number;
  data: T;
};
