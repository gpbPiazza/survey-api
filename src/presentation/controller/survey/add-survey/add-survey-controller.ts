import { Controller, HttpRequest, HttpResponse, Validation } from '../../../protocols'
import { badRequest } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {

  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const err = this.validation.validate(httpRequest.body)
    if (err) {
      return badRequest(err)
    }
    return await new Promise(resolve => resolve(null))
  }
}
