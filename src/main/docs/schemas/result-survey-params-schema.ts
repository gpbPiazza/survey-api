export const resultSurveyParamsSchema = {
  type: 'object',
  properties: {
    answer: {
      type: 'string'
    },
    date: {
      type: 'string'
    }
  },
  required: ['date', 'answer']
}
