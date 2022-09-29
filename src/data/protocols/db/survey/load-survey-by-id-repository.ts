import { SurveyModel } from '../../../usecases/survey/load-surveys/db-load-surveys-protocols'

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<SurveyModel>
}
