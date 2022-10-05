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
  }
}
