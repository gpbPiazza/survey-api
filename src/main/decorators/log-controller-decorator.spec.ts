import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { serverError, ok } from '../../presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

type MakeTypes = {
  logControllerDecorator: LogControllerDecorator
  anyController: Controller
  logErrorRepository: LogErrorRepository
}

const makeController = (): Controller => {
  class AnyController implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: httpRequest.body.name
        }
      }
      return await new Promise(resolve => resolve(httpResponse))
    }
  }
  return new AnyController()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class MockLogErrorRepository implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new MockLogErrorRepository()
}

const makeLogControllerDecorator = (): MakeTypes => {
  const anyController = makeController()
  const logErrorRepository = makeLogErrorRepository()
  const logControllerDecorator = new LogControllerDecorator(anyController, logErrorRepository)
  return { logControllerDecorator, anyController, logErrorRepository }
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@test.com.br',
    password: 'valid_password',
    passwordConfirmation: 'valid_password'
  }
})

const makeServerError = (): HttpResponse => {
  const mockStackError = 'any stack unexpected error'

  const mockError = new Error()

  mockError.stack = mockStackError

  return serverError(mockError)
}

describe('LogController Decorator', () => {
  test('Ensure Decoretor will call controller wrapped properly', async () => {
    const { logControllerDecorator, anyController } = makeLogControllerDecorator()

    const handleSpy = jest.spyOn(anyController, 'handle')

    const httpRequest = makeHttpRequest()

    await logControllerDecorator.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller wrapped', async () => {
    const { logControllerDecorator } = makeLogControllerDecorator()

    const httpRequest = makeHttpRequest()
    const { body } = httpRequest

    const httpResponse = await logControllerDecorator.handle(httpRequest)

    expect(httpResponse).toEqual(ok({ name: body.name }))
  })
  test('Should call LogErrorRepository with correct values when controller returns a server error', async () => {
    const { logControllerDecorator, anyController, logErrorRepository } = makeLogControllerDecorator()

    const error = makeServerError()

    const expectedStackError = error.body.stack

    const constrollerResponse: Promise<HttpResponse> = new Promise(resolve => resolve(error))

    jest.spyOn(anyController, 'handle').mockReturnValueOnce(constrollerResponse)

    const logSpy = jest.spyOn(logErrorRepository, 'logError')

    const httpRequest = makeHttpRequest()

    const httpResponse = await logControllerDecorator.handle(httpRequest)

    expect(httpResponse).toEqual(error)

    expect(logSpy).toHaveBeenCalledWith(expectedStackError)
  })
})
