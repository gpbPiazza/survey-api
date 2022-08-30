import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller, private readonly logErrorRepository: LogErrorRepository) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    const statusServerError = 500
    if (httpResponse.statusCode === statusServerError) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }

    return httpResponse
  }
}
