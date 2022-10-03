import { SurveyResultModel } from '../../models/survey-result'

export type AddSurveyResultModel = {
  surveyId: string
  accountId: string
  answerId: string
  date: Date
}

export interface SaveSurveyResult {
  save: (data: AddSurveyResultModel) => Promise<SurveyResultModel>
}
