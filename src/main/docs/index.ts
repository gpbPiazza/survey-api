
import components from './components'
import schemas from './schemas'
import paths from './paths'
export default {
  openapi: '3.0.0',
  info: {
    title: 'Survey API',
    description: 'Survey API is system provides admin users to create surveys with answers and common users to answer then',
    version: '1.1.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [
    {
      name: 'Login'
    }, {
      name: 'Surveys'
    }],
  paths,
  schemas,
  components
}
