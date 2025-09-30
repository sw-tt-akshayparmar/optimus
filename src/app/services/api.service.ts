import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../models/Response.model';
import environments from '../environments';
import storageConstants from '../constants/storage.constants';
import { Exception } from '../exception/app.exception';
import ErrorCode from '../enums/error.enum';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<Data = any, Error = any>(
    api: { path: string; auth?: boolean },
    params?: Array<string> | null,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.get<SuccessResponse<Data>>(options.url, options);
  }

  post<Data = any, Error = any>(
    api: { path: string; auth?: boolean },
    data?: any,
    params?: Array<string> | null,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.post<SuccessResponse<Data>>(options.url, data, options);
  }

  put<Data = any, Error = any>(
    api: { path: string; auth?: boolean },
    data?: any,
    params?: Array<string> | null,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.put<SuccessResponse<Data>>(options.url, data, options);
  }

  delete<Data = any, Error = any>(
    api: { path: string; auth?: boolean },
    params?: Array<string> | null,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.delete<SuccessResponse<Data>>(options.url, options);
  }

  private prepareAPI(
    api: { path: string; auth?: boolean },
    params?: Array<string> | null,
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
      const auth_token = localStorage.getItem(storageConstants.AUTHORIZATION_TOKEN);
      if (!auth_token)
        throw new Exception(
          ErrorCode.AUTH_NOT_FOUND,
          'Authentication token is missing, Please login',
          api,
        );
      httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + auth_token);
    }

    const paramPath = params && params.length ? '/' + params.map(encodeURIComponent).join('/') : '';
    const url = `${environments.API_BASE_URL}${api.path}${paramPath}`;

    return { url, headers: httpHeaders, params: query };
  }
}
