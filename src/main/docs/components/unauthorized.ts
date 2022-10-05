export const anauthorized = {
  description: 'Invalid credentials provided',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
