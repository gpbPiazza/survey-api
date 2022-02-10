
import { ServerError } from '../errors'
import { HttpResponse } from '../protocols'

export const badRequest = ({ message, name }: Error): HttpResponse => {
  return ({
    statusCode: 400,
    body: { name, message }
  })
}

export const serverError = ({ stack }: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(stack)
})

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body: body
})
