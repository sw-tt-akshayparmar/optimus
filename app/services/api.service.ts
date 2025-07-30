import * as envService from "./env.service";
import APIConfig from "~/config/api.config";
import { getAuthorazation } from "./storage.service";

export async function get(
  api: string,
  params?: { [key: string]: string },
  headers?: { [key: string]: string }
) {
  const url: string = getAPIURL(api, params);

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + getAuthorazation(),
      ...headers,
    },
  });
}

export function post(
  api: string,
  data?: any,
  params?: { [key: string]: string },
  headers?: { [key: string]: string }
) {
  const url: string = getAPIURL(api, params);
  fetch(url, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getAuthorazation(),
      ...headers,
    },
  });
}

export function put(
  api: string,
  data?: any,
  params?: { [key: string]: string },
  headers?: { [key: string]: string }
) {
  const url: string = getAPIURL(api, params);
  fetch(url, {
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getAuthorazation(),
      ...headers,
    },
  });
}

export function doDelete(
  api: string,
  params?: { [key: string]: string },
  headers?: { [key: string]: string }
) {
  const url: string = getAPIURL(api, params);
  fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + getAuthorazation(),
      ...headers,
    },
  });
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
