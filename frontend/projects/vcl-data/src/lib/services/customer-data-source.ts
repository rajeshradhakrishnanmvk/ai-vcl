import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataSource, PagedRequest, PagedResult } from '../models/data-source.model';

export interface CustomerDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone?: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerDataSource implements DataSource<CustomerDto> {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/customers';

  load(query: PagedRequest): Observable<PagedResult<CustomerDto>> {
    let params = new HttpParams()
      .set('page', query.page.toString())
      .set('pageSize', query.pageSize.toString());

    if (query.sort) params = params.set('sort', query.sort);
    if (query.filter) params = params.set('filter', query.filter);

    return this.http.get<PagedResult<CustomerDto>>(this.baseUrl, { params });
  }

  create(value: CreateCustomerRequest): Observable<CustomerDto> {
    return this.http.post<CustomerDto>(this.baseUrl, value);
  }

  update(id: string, value: Partial<CustomerDto>): Observable<CustomerDto> {
    return this.http.put<CustomerDto>(`${this.baseUrl}/${id}`, value);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getById(id: string): Observable<CustomerDto> {
    return this.http.get<CustomerDto>(`${this.baseUrl}/${id}`);
  }
}
