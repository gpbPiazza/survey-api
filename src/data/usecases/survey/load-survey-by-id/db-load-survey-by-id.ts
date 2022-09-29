import { LoadSurveyById } from '../../../../domain/usecases/survey/load-survey-by-id'
import { SurveyModel, LoadSurveyByIdRepository } from './db-load-surveys-protocols'

export class DBLoadSurveyById implements LoadSurveyById {
  constructor (private readonly repository: LoadSurveyByIdRepository) {}
  async loadById (id: string): Promise<SurveyModel> {
    return await this.repository.loadById(id)
  }
}
