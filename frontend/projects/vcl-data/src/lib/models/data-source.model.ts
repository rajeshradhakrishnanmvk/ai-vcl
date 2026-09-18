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

/**
 * Generic data source interface.
 *
 * @template T  - Entity type returned by `load` and `update`/`delete`.
 * @template TCreate - Payload type used by `create`. Defaults to `T` when omitted.
 */
export interface DataSource<T, TCreate = T> {
  load(query: PagedRequest): Observable<PagedResult<T>>;
  create?(value: TCreate): Observable<T>;
  update?(id: string, value: Partial<T>): Observable<T>;
  delete?(id: string): Observable<void>;
}
