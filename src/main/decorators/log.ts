import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logger: LogErrorRepository

  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logger = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    const statusServerError = 500
    if (httpResponse.statusCode === statusServerError) {
      await this.logger.log(httpResponse.body.stack)
    }

    return httpResponse
  }
}
