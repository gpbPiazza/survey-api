export interface AuthenticationModel {
  email: string
  password: string
}

export interface Authentication {
  auth: (model: AuthenticationModel) => Promise<string>
}
