import { AddSurveyModel, AddSurveyRepository } from '../../../../data/usecases/add-survey/db-add-survey-protocols'
import { LoadSurveysRepository, SurveyModel } from '../../../../data/usecases/load-surveys/db-load-surveys-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async loadAll (): Promise<SurveyModel[]> {
    const surveysCollection = MongoHelper.getCollection('surveys')
    const result = await surveysCollection.find().toArray()

    return result && MongoHelper.mapMany(result)
  }

  async add (input: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(input)
  }
}
