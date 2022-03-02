
import { ServerError } from '../errors'
import { HttpResponse } from '../protocols'

export const badRequest = ({ message, name }: Error): HttpResponse => {
  return ({
    statusCode: 400,
    body: { name, message }
  })
}

export const serverError = ({ stack }: Error): HttpResponse => {
  const serverError = new ServerError(stack)
  return {
    statusCode: 500,
    body: { name: serverError.name, message: serverError.message }
  }
}

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body: body
})
