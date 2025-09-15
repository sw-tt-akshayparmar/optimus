// src/app/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SuccessResponse } from '../models/Response.model';
import { getAuthorization } from '../../../../app/services/user.service';
import environments from '../environments';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<Data = any>(
    api: { path: string; auth?: boolean },
    params?: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.get<SuccessResponse<Data>>(options.url, options);
  }

  post<Data = any>(
    api: { path: string; auth?: boolean },
    data?: any,
    params?: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.post<SuccessResponse<Data>>(options.url, data, options);
  }

  put<Data = any>(
    api: { path: string; auth?: boolean },
    data?: any,
    params?: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.put<SuccessResponse<Data>>(options.url, data, options);
  }

  delete<Data = any>(
    api: { path: string; auth?: boolean },
    params?: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.delete<SuccessResponse<Data>>(options.url, options);
  }

  private prepareAPI(
    api: { path: string; auth?: boolean },
    params?: string,
    query?: Record<string, string>,
    headers: Record<string, string> = {},
  ): {
    url: string;
    headers: HttpHeaders;
    params?: Record<string, string>;
  } {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      ...headers,
    });
    if (api.auth) {
      httpHeaders.set('Authorization', 'Bearer ' + getAuthorization());
    }
    const url = `${environments.API_BASE_URL}${api}${params ? '/' + params : ''}`;
    return { url, headers: httpHeaders, params: query };
  }
}
