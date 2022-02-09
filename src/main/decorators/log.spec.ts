import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface MakeTYpes {
  logControllerDecorator: LogControllerDecorator
  anyController: Controller
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

const makeLogControllerDecorator = (): MakeTYpes => {
  const anyController = makeController()
  const logControllerDecorator = new LogControllerDecorator(anyController)
  return { logControllerDecorator, anyController }
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
})
