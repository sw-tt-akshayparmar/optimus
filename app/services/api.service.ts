import * as envService from "./env.service";
import { getAuthorazation } from "../services/user.service";
import type { ErrorResponse, SuccessResponse } from "~/models/Response.model";
import { Exception } from "~/exception/app.exception";

export async function get<Data>(
  api: { path: string; auth?: boolean },
  params?: string,
  query?: { [key: string]: string },
  headers?: { [key: string]: string }
): Promise<SuccessResponse<Data> | ErrorResponse> {
  return request("GET", api, null, params, query, headers);
}

export async function post<Data>(
  api: { path: string; auth?: boolean },
  data?: any,
  params?: string,
  query?: { [key: string]: string },
  headers?: { [key: string]: string }
): Promise<SuccessResponse<Data> | ErrorResponse> {
  return request("POST", api, data, params, query, headers);
}

export async function put<Data>(
  api: { path: string; auth?: boolean },
  data?: any,
  params?: string,
  query?: { [key: string]: string },
  headers?: { [key: string]: string }
): Promise<SuccessResponse<Data> | ErrorResponse> {
  return request("PUT", api, data, params, query, headers);
}

export async function doDelete<Data>(
  api: { path: string; auth?: boolean },
  params?: string,
  query?: { [key: string]: string },
  headers?: { [key: string]: string }
): Promise<SuccessResponse<Data> | ErrorResponse> {
  return request("DELETE", api, null, params, query, headers);
}

async function request(
  method: "GET" | "POST" | "PUT" | "DELETE",
  api: { path: string; auth?: boolean },
  data?: any,
  params: string = "",
  query: { [key: string]: string } = {},
  headers: { [key: string]: string } = {}
): Promise<SuccessResponse | ErrorResponse> {
  const url: string = getAPIURL(api.path, params, query);
  if (api.auth) {
    headers.Authorization = "Bearer " + getAuthorazation();
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
      throw new Exception(resBody.code, resBody.error, resBody.data);
    }
    return resBody;
  } catch (err: Exception | Error | any) {
    throw err;
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
