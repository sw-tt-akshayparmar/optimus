import * as envService from "./env.service";
import APIConfig from "~/config/api.config";
import { getAuthorazation } from "./storage.service";

export async function get(
  api: string,
  params?: { [key: string]: string },
  headers?: { [key: string]: string }
) {
  return request("GET", api, null, params, headers);
}

export async function post(
  api: string,
  data?: any,
  params?: { [key: string]: string },
  headers?: { [key: string]: string }
) {
  return request("POST", api, data, params, headers);
}

export async function put(
  api: string,
  data?: any,
  params?: { [key: string]: string },
  headers?: { [key: string]: string }
) {
  return request("PUT", api, data, params, headers);
}

export async function doDelete(
  api: string,
  params?: { [key: string]: string },
  headers?: { [key: string]: string }
) {
  return request("DELETE", api, null, params, headers);
}

async function request(
  method: "GET" | "POST" | "PUT" | "DELETE",
  api: string,
  data?: any,
  params?: { [key: string]: string },
  headers?: { [key: string]: string }
) {
  const url: string = getAPIURL(api, params);
  const res = await fetch(url, {
    method,
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getAuthorazation(),
      ...headers,
    },
  });
  return res.json();
}

function getAPIURL(api: string, params?: { [key: string]: string }) {
  let query = "";
  if (params && Object.keys(params).length > 0) {
    const queryParams = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    query = `?${queryParams}`;
  }
  return `${envService.getServerUrl()}${APIConfig.API_ROOT}${api}${query}`;
}
