
import { AddSurvey, AddSurveyParam, AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly repository: AddSurveyRepository) {}

  async add (input: AddSurveyParam): Promise<void> {
    return await this.repository.add(input)
  }
}
