import * as envService from "./env.service";
import { getAuthorization } from "~/services/user.service";
import type { ErrorResponse, SuccessResponse } from "~/models/Response.model";
import { Exception } from "~/exception/app.exception";
import ErrorCode from "~/enums/error.enum";

export async function get<Data = any>(
  api: { path: string; auth?: boolean },
  params?: string,
  query?: { [key: string]: string },
  headers?: { [key: string]: string }
): Promise<SuccessResponse<Data>> {
  return request<Data>("GET", api, null, params, query, headers);
}

export async function post<Data = any>(
  api: { path: string; auth?: boolean },
  data?: any,
  params?: string,
  query?: { [key: string]: string },
  headers?: { [key: string]: string }
): Promise<SuccessResponse<Data>> {
  return request("POST", api, data, params, query, headers);
}

export async function put<Data = any>(
  api: { path: string; auth?: boolean },
  data?: any,
  params?: string,
  query?: { [key: string]: string },
  headers?: { [key: string]: string }
): Promise<SuccessResponse<Data>> {
  return request("PUT", api, data, params, query, headers);
}

export async function doDelete<Data = any>(
  api: { path: string; auth?: boolean },
  params?: string,
  query?: { [key: string]: string },
  headers?: { [key: string]: string }
): Promise<SuccessResponse<Data>> {
  return request("DELETE", api, null, params, query, headers);
}

async function request<Data = any>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  api: { path: string; auth?: boolean },
  data?: any,
  params: string = "",
  query: { [key: string]: string } = {},
  headers: { [key: string]: string } = {}
): Promise<SuccessResponse> {
  const url: string = getAPIURL(api.path, params, query);
  if (api.auth) {
    headers.Authorization = "Bearer " + getAuthorization();
  }
  try {
    const res = await fetch(url, {
      method,
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    const resBody: SuccessResponse | ErrorResponse = await res.json();
    if (!resBody.isSuccessFull) {
      throw new Exception(resBody.code, resBody.error, resBody);
    }
    return resBody;
  } catch (err: Exception | Error | any) {
    if (err instanceof Exception) {
      throw err;
    }
    // Handle more generic API failure here if possible
    throw new Exception(ErrorCode.API_FAILURE, err.message, err);
  }
}

function getAPIURL(api: string, params?: string, query?: { [key: string]: string }) {
  let queryString = "";
  if (query && Object.keys(query).length > 0) {
    queryString = Object.entries(query)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
  }

  return `${envService.getAPIBaseUrl()}${api}${params ? "/" : ""}${params}?${queryString}`;
}
