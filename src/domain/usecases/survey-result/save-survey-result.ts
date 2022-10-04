import { SurveyResultModel } from '../../models/survey-result'

export type AddSurveyResultParams = {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export interface SaveSurveyResult {
  save: (data: AddSurveyResultParams) => Promise<SurveyResultModel>
}
