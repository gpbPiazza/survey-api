export type AddSurveyAnswer = {
  image?: string
  answer: string
}
export type AddSurveyModel = {
  question: string
  answers: AddSurveyAnswer[]
  date: Date
}

export interface AddSurvey {
  add: (input: AddSurveyModel) => Promise<void>
}
