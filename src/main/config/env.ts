export default {
  mongoUlr: process.env.MONGO_URL || 'mongodb://localhost:27017/survey-node-api',
  port: process.env.PORT || 5050,
  saltEncrypt: 12,
  jwtSecrect: process.env.JWT_SECRECT || 'TJ670==5hw'
}
