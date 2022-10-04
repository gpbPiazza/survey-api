import { AddSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from '../../../../data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (input: AddSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = MongoHelper.getCollection('surveyResults')
    const result = await surveyResultCollection.findOneAndUpdate({
      surveyId: input.surveyId,
      accountId: input.accountId

    }, {
      $set: {
        answer: input.answer,
        date: input.date
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    })

    return result.value && MongoHelper.map(result.value)
  }
}
