import type { AxiosRequestConfig } from 'axios'
import { http, exec } from './client'

export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return exec<T>(http.get<T>(url, config))
}

export async function post<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  return exec<T>(http.post<T>(url, body, config))
}

export async function put<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  return exec<T>(http.put<T>(url, body, config))
}

export async function patch<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  return exec<T>(http.patch<T>(url, body, config))
}

export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return exec<T>(http.delete<T>(url, config))
}
