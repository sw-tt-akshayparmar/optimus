import * as envService from "./env.service";
import { getAuthorazation } from "../services/user.service";
import type { ErrorResponse, SuccessResponse } from "~/models/Response.model";

export async function get<Data>(
  api: { path: string; auth?: boolean },
  params?: { [key: string]: string },
  headers?: { [key: string]: string }
): Promise<SuccessResponse<Data> | ErrorResponse> {
  return request("GET", api, null, params, headers);
}

export async function post<Data>(
  api: { path: string; auth?: boolean },
  data?: any,
  params?: { [key: string]: string },
  headers?: { [key: string]: string }
): Promise<SuccessResponse<Data> | ErrorResponse> {
  return request("POST", api, data, params, headers);
}

export async function put<Data>(
  api: { path: string; auth?: boolean },
  data?: any,
  params?: { [key: string]: string },
  headers?: { [key: string]: string }
): Promise<SuccessResponse<Data> | ErrorResponse> {
  return request("PUT", api, data, params, headers);
}

export async function doDelete<Data>(
  api: { path: string; auth?: boolean },
  params?: { [key: string]: string },
  headers?: { [key: string]: string }
): Promise<SuccessResponse<Data> | ErrorResponse> {
  return request("DELETE", api, null, params, headers);
}

async function request(
  method: "GET" | "POST" | "PUT" | "DELETE",
  api: { path: string; auth?: boolean },
  data?: any,
  params: { [key: string]: string } = {},
  headers: { [key: string]: string } = {}
): Promise<SuccessResponse | ErrorResponse> {
  const url: string = getAPIURL(api.path, params);
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
    const resBody: SuccessResponse = await res.json();
    return resBody;
  } catch (err: Error | any) {
    throw err;
  }
}

function getAPIURL(api: string, params?: { [key: string]: string }) {
  let query = "";
  if (params && Object.keys(params).length > 0) {
    const queryParams = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    query = `?${queryParams}`;
  }
  return `${envService.getAPIBaseUrl()}${api}${query}`;
}
