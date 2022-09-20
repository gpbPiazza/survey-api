import { DbAddSurvey } from '../../../../data/usecases/add-survey/db-add-survey'
import { AddSurvey } from '../../../../domain/usecases/add-survey'
import { SurveyMongoRepository } from '../../../../infra/repositories/no-sql/survey-repository/survey-mongo-repository'

export const makeAddSurvey = (): AddSurvey => {
  const surveyRepository = new SurveyMongoRepository()

  return new DbAddSurvey(surveyRepository)
}
