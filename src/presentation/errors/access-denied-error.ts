export class AccessDeniedError extends Error {
  constructor () {
    super('access denied')
    this.name = 'AccessDeniedError'
  }
}
