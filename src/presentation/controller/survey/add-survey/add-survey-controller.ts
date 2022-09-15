import {
  Validation,
  HttpRequest,
  AddSurvey,
  Controller,
  HttpResponse
} from './add-survey-controller-protocols'
import { noContent, badRequest, serverError } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const err = this.validation.validate(body)
      if (err) {
        return badRequest(err)
      }

      await this.addSurvey.add(body)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
