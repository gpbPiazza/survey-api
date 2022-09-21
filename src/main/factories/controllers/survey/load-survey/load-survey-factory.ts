import { LoadSurveysController } from '../../../../../presentation/controller/survey/load-surveys/load-surveys-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDBLoadSurveys } from '../../../usecases/survey/db-load-surveys-factory'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveysController = new LoadSurveysController(makeDBLoadSurveys())

  return makeLogControllerDecorator(loadSurveysController)
}
