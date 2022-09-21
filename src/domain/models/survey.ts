import { AnswerModel } from './answer'

export interface SurveyModel {
  id: string
  question: string
  answers: AnswerModel[]
  date: Date
}
