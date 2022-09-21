import { LoadSurveys, SurveyModel, LoadSurveysRepository } from './db-load-surveys-protocols'

export class DBLoadSurveys implements LoadSurveys {
  constructor (private readonly repository: LoadSurveysRepository) {}
  async load (): Promise<SurveyModel[]> {
    return await this.repository.load()
  }
}
