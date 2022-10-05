export const surveysPath = {
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Surveys'],
    summary: 'API to load all surveys',
    responses: {
      200: {
        description: 'sucess',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      403: {
        $ref: '#/components/forbidden'
      }
    }
  },
  post: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Surveys'],
    summary: 'API to create one survey',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/postSurveyParams'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'sucess'
      },
      400: {
        $ref: '#/components/badRequest'
      },
      403: {
        $ref: '#/components/forbidden'
      }
    }
  }
}
