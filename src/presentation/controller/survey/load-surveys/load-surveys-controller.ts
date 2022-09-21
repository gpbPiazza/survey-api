import {
  HttpRequest,
  Controller,
  HttpResponse,
  LoadSurveys
} from './load-surveys-controller-protocols'
import { serverError, ok } from '../../../helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const response = await this.loadSurveys.loadAll()
      return ok(response)
    } catch (error) {
      return serverError(error)
    }
  }
}
