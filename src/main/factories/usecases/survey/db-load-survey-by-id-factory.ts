import { DBLoadSurveyById } from '../../../../data/usecases/survey/load-survey-by-id/db-load-survey-by-id'
import { LoadSurveyById } from '../../../../domain/usecases/survey/load-survey-by-id'
import { SurveyMongoRepository } from '../../../../infra/repositories/no-sql/survey-repository/survey-mongo-repository'

export const makeDBLoadSurveyById = (): LoadSurveyById => {
  const surveyRepository = new SurveyMongoRepository()

  return new DBLoadSurveyById(surveyRepository)
}
