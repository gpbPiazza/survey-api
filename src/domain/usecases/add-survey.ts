export interface AddSurveyAnswer {
  image?: string
  answer: string
}
export interface AddSurveyModel {
  question: string
  answers: AddSurveyAnswer[]
  date: Date
}

export interface AddSurvey {
  add: (input: AddSurveyModel) => Promise<void>
}
