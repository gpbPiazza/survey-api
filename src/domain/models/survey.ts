import { AnswerModel } from './answer'

export type SurveyModel = {
  id: string
  question: string
  answers: AnswerModel[]
  date: Date
}
