import { InvalidParamError } from '../../../errors'
import { HttpRequest, HttpResponse } from '../../../protocols'
import { LoadSurveyById, Controller, SaveSurveyResult } from './save-survey-result-controller-protocols'
import { badRequest, forbbiden, serverError, ok } from '../../../helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { body, accountId } = httpRequest

      const survey = await this.loadSurveyById.loadById(surveyId)

      if (!survey) {
        return forbbiden(new InvalidParamError('surveyId'))
      }

      const answers = survey.answers.map(a => a.answer)
      if (!answers.includes(body.answer)) {
        return badRequest(new InvalidParamError('answer'))
      }

      const response = await this.saveSurveyResult.save({
        surveyId,
        answer: body.answer,
        accountId,
        date: body.date
      })

      return ok(response)
    } catch (err) {
      return serverError(err)
    }
  }
}
