import { loginPath, signUpPath, surveyResultPath, surveysPath } from './paths/'
export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': surveysPath,
  '/surveys/{surveyId}/results': surveyResultPath
}
