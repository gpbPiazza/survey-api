import { SurveyModel } from '../../../usecases/load-surveys/db-load-surveys-protocols'

export interface LoadSurveysRepository {
  load: () => Promise<SurveyModel[]>
}
