import { AddSurveyParam } from '../../../usecases/survey/add-survey/db-add-survey-protocols'

export interface AddSurveyRepository {
  add: (input: AddSurveyParam) => Promise<void>
}
