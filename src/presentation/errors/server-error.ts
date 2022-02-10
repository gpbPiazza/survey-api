export class ServerError extends Error {
  constructor (stackError?: string) {
    super('Internal server error')
    this.name = 'ServerError'
    this.stack = stackError
  }
}
