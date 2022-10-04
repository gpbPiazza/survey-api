export type AuthenticationParam = {
  email: string
  password: string
}

export interface Authentication {
  auth: (model: AuthenticationParam) => Promise<string>
}
