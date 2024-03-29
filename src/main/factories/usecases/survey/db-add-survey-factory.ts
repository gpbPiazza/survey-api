import { DbAddSurvey } from '../../../../data/usecases/survey/add-survey/db-add-survey'
import { AddSurvey } from '../../../../domain/usecases/survey/add-survey'
import { SurveyMongoRepository } from '../../../../infra/repositories/no-sql/survey-repository/survey-mongo-repository'

export const makeAddSurvey = (): AddSurvey => {
  const surveyRepository = new SurveyMongoRepository()

  return new DbAddSurvey(surveyRepository)
}
