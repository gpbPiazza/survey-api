import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
  badRequest,
  AddSurvey
} from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    const err = this.validation.validate(body)
    if (err) {
      return badRequest(err)
    }

    await this.addSurvey.add(body)
    return await new Promise(resolve => resolve(null))
  }
}
