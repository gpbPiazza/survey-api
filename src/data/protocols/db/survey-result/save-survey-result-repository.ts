import { AddSurveyResultModel, SurveyResultModel } from '../../../usecases/survey-result/save-survey-result/db-save-survey-result-protocols'

export interface SaveSurveyResultRepository {
  save: (input: AddSurveyResultModel) => Promise<SurveyResultModel>
}
