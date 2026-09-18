import { Observable } from 'rxjs';

export interface PagedRequest {
  page: number;
  pageSize: number;
  sort?: string;
  filter?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface DataSource<T, TQuery = PagedRequest> {
  load(query: TQuery): Observable<PagedResult<T>>;
  create?(value: T): Observable<T>;
  update?(id: string, value: Partial<T>): Observable<T>;
  delete?(id: string): Observable<void>;
}
