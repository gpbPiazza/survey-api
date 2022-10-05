import {
  loginParamsSchema
  , errorSchema
  , accountSchema
  , surveySchema
  , surveyAnswerSchema
  , surveysSchema
  , signUpParamsSchema
  , postSurveyParamsSchema
  , resultSurveyParamsSchema
  , surveyResultSchema
} from './schemas/'

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  error: errorSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveys: surveysSchema,
  postSurveyParams: postSurveyParamsSchema,
  resultSurveyParams: resultSurveyParamsSchema,
  surveyResult: surveyResultSchema
}
