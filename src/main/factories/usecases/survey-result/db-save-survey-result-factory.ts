import { DBSaveSurveyResult } from '../../../../data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { SaveSurveyResult } from '../../../../domain/usecases/survey-result/save-survey-result'
import { SurveyResultMongoRepository } from '../../../../infra/repositories/no-sql/survey-result-repository/survey-result-mongo-repository'

export const makeDBSaveSurveysResult = (): SaveSurveyResult => {
  const repository = new SurveyResultMongoRepository()

  return new DBSaveSurveyResult(repository)
}
