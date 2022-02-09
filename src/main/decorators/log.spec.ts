import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

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

const makeLogControllerDecorator = (): {logControllerDecorator: LogControllerDecorator, anyController: AnyController} => {
  const anyController = new AnyController()
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
})
