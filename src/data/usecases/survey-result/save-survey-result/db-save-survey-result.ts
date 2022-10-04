import { SaveSurveyResultRepository, SaveSurveyResult, AddSurveyResultParams, SurveyResultModel } from './db-save-survey-result-protocols'

export class DBSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly repository: SaveSurveyResultRepository) {}
  async save (data: AddSurveyResultParams): Promise<SurveyResultModel> {
    return await this.repository.save(data)
  }
}
