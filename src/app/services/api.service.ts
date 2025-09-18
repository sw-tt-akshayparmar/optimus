import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorResponse, SuccessResponse } from '../models/Response.model';
import environments from '../environments';
import storageConstants from '../constants/storage.constants';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<Data = any, Error = any>(
    api: { path: string; auth?: boolean },
    params?: Array<string>,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> | false {
    const options = this.prepareAPI(api, params, query, headers);
    if (options) {
      return this.http.get<SuccessResponse<Data>>(options.url, options);
    }
    return false;
  }

  post<Data = any, Error = any>(
    api: { path: string; auth?: boolean },
    data?: any,
    params?: Array<string>,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data>> | false {
    const options = this.prepareAPI(api, params, query, headers);
    if (options) {
      return this.http.post<SuccessResponse<Data>>(options.url, data, options);
    }
    return false;
  }

  put<Data = any, Error = any>(
    api: { path: string; auth?: boolean },
    data?: any,
    params?: Array<string>,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data> | ErrorResponse<Error>> | false {
    const options = this.prepareAPI(api, params, query, headers);
    if (options) {
      return this.http.put<SuccessResponse<Data>>(options.url, data, options);
    }
    return false;
  }

  delete<Data = any, Error = any>(
    api: { path: string; auth?: boolean },
    params?: Array<string>,
    query?: Record<string, string>,
    headers?: Record<string, string>,
  ): Observable<SuccessResponse<Data> | ErrorResponse<Error>> | false {
    const options = this.prepareAPI(api, params, query, headers);
    if (options) {
      return this.http.delete<SuccessResponse<Data>>(options.url, options);
    }
    return false;
  }

  private prepareAPI(
    api: { path: string; auth?: boolean },
    params?: Array<string>,
    query?: Record<string, string>,
    headers: Record<string, string> = {},
  ):
    | {
        url: string;
        headers: HttpHeaders;
        params?: Record<string, string>;
      }
    | false {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      ...headers,
    });

    if (api.auth) {
      const auth_token = localStorage.getItem(storageConstants.AUTHORIZATION_TOKEN);
      if (!auth_token) return false;
      httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + auth_token);
    }

    const paramPath = params && params.length ? '/' + params.join('/') : '';
    const url = `${environments.API_BASE_URL}${api.path}${paramPath}`;

    return { url, headers: httpHeaders, params: query };
  }
}
