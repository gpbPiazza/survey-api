import { SaveSurveyResultController } from '../../../../../presentation/controller/survey-result/save-survey-result/save-survey-result-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDBSaveSurveysResult } from '../../../usecases/survey-result/db-save-survey-result-factory'
import { makeDBLoadSurveyById } from '../../../usecases/survey/db-load-survey-by-id-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDBLoadSurveyById(), makeDBSaveSurveysResult())

  return makeLogControllerDecorator(controller)
}
