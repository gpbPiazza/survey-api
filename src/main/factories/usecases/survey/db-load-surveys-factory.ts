import { DBLoadSurveys } from '../../../../data/usecases/load-surveys/db-load-surveys'
import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { SurveyMongoRepository } from '../../../../infra/repositories/no-sql/survey-repository/survey-mongo-repository'

export const makeDBLoadSurveys = (): LoadSurveys => {
  const surveyRepository = new SurveyMongoRepository()

  return new DBLoadSurveys(surveyRepository)
}
