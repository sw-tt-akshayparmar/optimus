import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../models/Response.model';
import environments from '../environments';
import Keys from '../enums/keys.enum';
import { Exception } from '../exception/app.exception';
import ErrorCode from '../enums/error.enum';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly platformId = inject(PLATFORM_ID);
  constructor(private readonly http: HttpClient) {}

  get<Data = any, Error = any>(
    api: { path: string; noAuth?: boolean },
    params?: Array<string> | null,
    query?: Record<string, string | number | undefined>,
    headers?: Record<string, string | number | undefined>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.get<SuccessResponse<Data>>(options.url, options);
  }

  post<Data = any, Error = any>(
    api: { path: string; noAuth?: boolean },
    data?: any,
    params?: Array<string> | null,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.post<SuccessResponse<Data>>(options.url, data, options);
  }

  put<Data = any, Error = any>(
    api: { path: string; noAuth?: boolean },
    data?: any,
    params?: Array<string> | null,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.put<SuccessResponse<Data>>(options.url, data, options);
  }

  delete<Data = any, Error = any>(
    api: { path: string; noAuth?: boolean },
    params?: Array<string> | null,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.delete<SuccessResponse<Data>>(options.url, options);
  }

  private prepareAPI(
    api: { path: string; noAuth?: boolean },
    params?: Array<string> | null,
    query?: Record<string, string | number | undefined>,
    headers: Record<string, string | number | undefined> = {},
  ): {
    url: string;
    headers: HttpHeaders;
    params?: Record<string, string>;
  } {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      ...headers,
    });

    if (!api.noAuth) {
      let auth_token: string | null = null;
      if (isPlatformBrowser(this.platformId)) {
        auth_token = localStorage.getItem(Keys.AUTHORIZATION_TOKEN);
        if (!auth_token)
          throw new Exception(
            ErrorCode.AUTH_NOT_FOUND,
            'Authentication token is missing, Please login',
            api,
          );
      }
      httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + auth_token);
    }

    const paramPath = params?.length ? '/' + params.map(encodeURIComponent).join('/') : '';
    const url = `${environments.API_BASE_URL}${api.path}${paramPath}`;
    let p: Record<string, string> = {};
    if (query) {
      Object.entries(query).forEach(([k, v]) => {
        if (v) {
          p[k] = v.toString();
        }
      });
    }

    return { url, headers: httpHeaders, params: p };
  }
}
