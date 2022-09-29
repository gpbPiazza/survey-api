import { SurveyModel } from '../../models/survey'

export interface LoadSurveys {
  loadAll: () => Promise<SurveyModel[]>
}
