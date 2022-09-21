import { LoadSurveys, SurveyModel, LoadSurveysRepository } from './db-load-surveys-protocols'

export class DBLoadSurveys implements LoadSurveys {
  constructor (private readonly repository: LoadSurveysRepository) {}
  async loadAll (): Promise<SurveyModel[]> {
    return await this.repository.loadAll()
  }
}
