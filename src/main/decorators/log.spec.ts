import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { ServerError } from '../../presentation/errors/server-error'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface MakeTYpes {
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
    async log (stack: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new MockLogErrorRepository()
}

const makeLogControllerDecorator = (): MakeTYpes => {
  const anyController = makeController()
  const logErrorRepository = makeLogErrorRepository()
  const logControllerDecorator = new LogControllerDecorator(anyController, logErrorRepository)
  return { logControllerDecorator, anyController, logErrorRepository }
}

describe('LogController Decorator', () => {
  test('Ensure Decoretor will call controller wrapped properly', async () => {
    const { logControllerDecorator, anyController } = makeLogControllerDecorator()

    const handleSpy = jest.spyOn(anyController, 'handle')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await logControllerDecorator.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller wrapped', async () => {
    const { logControllerDecorator } = makeLogControllerDecorator()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponseExpected: HttpResponse = {
      statusCode: 200,
      body: {
        name: httpRequest.body.name
      }
    }

    const httpResponse = await logControllerDecorator.handle(httpRequest)

    expect(httpResponse).toEqual(httpResponseExpected)
  })
  test('Should call LogErrorRepository with correct values when controller returns a server error', async () => {
    const { logControllerDecorator, anyController, logErrorRepository } = makeLogControllerDecorator()

    const mockStackError = 'any stack unexpected error'

    const exptectedServerError = new ServerError(mockStackError)

    const mockError = new Error()
    mockError.stack = mockStackError

    const mockHttpResponse = serverError(mockError)

    const constrollerResponse: Promise<HttpResponse> = new Promise(resolve => resolve(mockHttpResponse))

    const logErrorRepositoryResponse: Promise<void> = new Promise(resolve => resolve())

    jest.spyOn(anyController, 'handle').mockReturnValueOnce(constrollerResponse)

    const logSpy = jest.spyOn(logErrorRepository, 'log').mockReturnValueOnce(logErrorRepositoryResponse)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await logControllerDecorator.handle(httpRequest)

    expect(httpResponse.body).toEqual(exptectedServerError)

    expect(logSpy).toHaveBeenCalledWith(mockStackError)
  })
})
