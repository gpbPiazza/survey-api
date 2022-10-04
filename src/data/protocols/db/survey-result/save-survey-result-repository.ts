import { AddSurveyResultParams, SurveyResultModel } from '../../../usecases/survey-result/save-survey-result/db-save-survey-result-protocols'

export interface SaveSurveyResultRepository {
  save: (input: AddSurveyResultParams) => Promise<SurveyResultModel>
}
