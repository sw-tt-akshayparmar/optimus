import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
    params?: Array<string>,
    query?: Record<string, string | number | boolean>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    if (api.auth && options.missingAuth) {
      return throwError(() =>
        new Exception(
          ErrorCode.AUTH_NOT_FOUND,
          'Authentication token is missing, Please login',
          api,
        ),
      );
    }
    return this.http.get<SuccessResponse<Data>>(options.url, options);
  }

  post<Data = any, Error = any>(
    api: { path: string; auth?: boolean },
    data?: any,
    params?: Array<string>,
    query?: Record<string, string | number | boolean>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    if (api.auth && options.missingAuth) {
      return throwError(() =>
        new Exception(
          ErrorCode.AUTH_NOT_FOUND,
          'Authentication token is missing, Please login',
          api,
        ),
      );
    }
    return this.http.post<SuccessResponse<Data>>(options.url, data, options);
  }

  put<Data = any, Error = any>(
    api: { path: string; auth?: boolean },
    data?: any,
    params?: Array<string>,
    query?: Record<string, string | number | boolean>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    if (api.auth && options.missingAuth) {
      return throwError(() =>
        new Exception(
          ErrorCode.AUTH_NOT_FOUND,
          'Authentication token is missing, Please login',
          api,
        ),
      );
    }
    return this.http.put<SuccessResponse<Data>>(options.url, data, options);
  }

  delete<Data = any, Error = any>(
    api: { path: string; auth?: boolean },
    params?: Array<string>,
    query?: Record<string, string | number | boolean>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    if (api.auth && options.missingAuth) {
      return throwError(() =>
        new Exception(
          ErrorCode.AUTH_NOT_FOUND,
          'Authentication token is missing, Please login',
          api,
        ),
      );
    }
    return this.http.delete<SuccessResponse<Data>>(options.url, options);
  }

  private prepareAPI(
    api: { path: string; auth?: boolean },
    params?: Array<string>,
    query?: Record<string, string | number | boolean>,
    headers: Record<string, string> = {},
  ): {
    url: string;
    headers: HttpHeaders;
    params?: Record<string, string | number | boolean>;
    missingAuth?: boolean;
  } {
    const platformId = inject(PLATFORM_ID);
    const isBrowser = isPlatformBrowser(platformId);

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      ...headers,
    });

    let missingAuth = false;
    if (api.auth) {
      if (isBrowser) {
        const auth_token = localStorage.getItem(storageConstants.AUTHORIZATION_TOKEN);
        if (auth_token) {
          httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + auth_token);
        } else {
          missingAuth = true;
        }
      } else {
        // On the server, do not access localStorage; mark as missing
        missingAuth = true;
      }
    }

    const paramPath = params && params.length ? '/' + params.map(encodeURIComponent).join('/') : '';
    const url = `${environments.API_BASE_URL}${api.path}${paramPath}`;

    return { url, headers: httpHeaders, params: query, missingAuth };
  }
}
