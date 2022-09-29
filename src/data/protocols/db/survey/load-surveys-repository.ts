import { SurveyModel } from '../../../usecases/survey/load-surveys/db-load-surveys-protocols'

export interface LoadSurveysRepository {
  loadAll: () => Promise<SurveyModel[]>
}
