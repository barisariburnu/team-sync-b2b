import {
  get,
  post,
  patch,
  del,
  type ApiItemResponse,
  type ApiListResponse,
} from '@services/http'
import type { JsonObject } from '@shared/types/json'

// Domain types
export interface Organization {
  id: number
  name: string
  metadata?: JsonObject
  createdAt?: string
  updatedAt?: string
}

export interface CreateOrganizationDto {
  name: string
  metadata?: JsonObject
}

export interface UpdateOrganizationDto {
  name?: string
  metadata?: JsonObject
}

// Service functions
export async function listOrganizations(): Promise<
  ApiListResponse<Organization>
> {
  return get<ApiListResponse<Organization>>('/organizations')
}

export async function getOrganization(
  id: number
): Promise<ApiItemResponse<Organization>> {
  return get<ApiItemResponse<Organization>>(`/organizations/${id}`)
}

export async function createOrganization(
  payload: CreateOrganizationDto
): Promise<ApiItemResponse<Organization>> {
  return post<ApiItemResponse<Organization>, CreateOrganizationDto>(
    '/organizations',
    payload
  )
}

export async function updateOrganization(
  id: number,
  payload: UpdateOrganizationDto
): Promise<ApiItemResponse<Organization>> {
  return patch<ApiItemResponse<Organization>, UpdateOrganizationDto>(
    `/organizations/${id}`,
    payload
  )
}

export async function deleteOrganization(id: number): Promise<void> {
  await del<void>(`/organizations/${id}`)
}
