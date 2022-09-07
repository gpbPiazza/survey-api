export class EmailInUserError extends Error {
  constructor () {
    super('The receivabed email is already in use')
    this.name = 'EmailInUserError'
  }
}
