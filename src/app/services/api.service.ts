import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ErrorResponse, SuccessResponse } from '../models/Response.model';
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
    params?: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.get<SuccessResponse<Data>>(options.url, options);
  }

  post<Data = any, Error = any>(
    api: { path: string; auth?: boolean },
    data?: any,
    params?: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data> | ErrorResponse<Error>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.post<SuccessResponse<Data> | ErrorResponse<Error>>(options.url, data, options);
  }

  put<Data = any, Error = any>(
    api: { path: string; auth?: boolean },
    data?: any,
    params?: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data> | ErrorResponse<Error>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.put<SuccessResponse<Data> | ErrorResponse<Error>>(options.url, data, options);
  }

  delete<Data = any, Error = any>(
    api: { path: string; auth?: boolean },
    params?: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data> | ErrorResponse<Error>> {
    const options = this.prepareAPI(api, params, query, headers);
    return this.http.delete<SuccessResponse<Data> | ErrorResponse<Error>>(options.url, options);
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
    if (api.auth && localStorage.getItem(storageConstants.AUTHORIZATION_TOKEN)) {
      httpHeaders.set(
        'Authorization',
        'Bearer ' + localStorage.getItem(storageConstants.AUTHORIZATION_TOKEN),
      );
    } else {
      throw throwError(() => new Exception(ErrorCode.AUTH_NOT_FOUND));
    }
    const url = `${environments.API_BASE_URL}${api}${params ? '/' + params : ''}`;
    return { url, headers: httpHeaders, params: query };
  }
}
