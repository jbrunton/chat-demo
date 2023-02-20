export type QueryOptions = {
  enabled: boolean
}

export const DefaultQueryOptions: QueryOptions = {
  enabled: true,
}

export type PermissionedResponse = {
  roles: string[]
}

export const can = (action: string, response?: PermissionedResponse): boolean => {
  return (response?.roles ?? []).includes(action)
}
