export type AddSurveyAnswerParam = {
  image?: string
  answer: string
}
export type AddSurveyParam = {
  question: string
  answers: AddSurveyAnswerParam[]
  date: Date
}

export interface AddSurvey {
  add: (input: AddSurveyParam) => Promise<void>
}
