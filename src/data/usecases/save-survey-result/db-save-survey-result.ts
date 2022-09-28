import { SaveSurveyResult, AddSurveyResultModel, SurveyResultModel } from './db-save-survey-result-protocols'

export class DBSaveSurveyResult implements SaveSurveyResult {
  async save (data: AddSurveyResultModel): Promise<SurveyResultModel> {
    return null
  }
}
