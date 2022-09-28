import { ObjectID } from 'bson'
import { LoadSurveyByIdRepository } from '../../../../data/protocols/db/survey/load-survey-by-id-repository'
import { AddSurveyModel, AddSurveyRepository } from '../../../../data/usecases/add-survey/db-add-survey-protocols'
import { LoadSurveysRepository, SurveyModel } from '../../../../data/usecases/load-surveys/db-load-surveys-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async loadAll (): Promise<SurveyModel[]> {
    const surveysCollection = MongoHelper.getCollection('surveys')
    const result = await surveysCollection.find().toArray()
    return result && MongoHelper.mapMany(result)
  }

  async add (input: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(input)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveysCollection = MongoHelper.getCollection('surveys')
    const result = await surveysCollection.findOne({ _id: new ObjectID(id) })
    return result && MongoHelper.map(result)
  }
}
