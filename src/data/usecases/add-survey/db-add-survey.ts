
import { AddSurvey, AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly repository: AddSurveyRepository) {}

  async add (input: AddSurveyModel): Promise<void> {
    await this.repository.add(input)
    return await new Promise(resolve => resolve(null))
  }
}
