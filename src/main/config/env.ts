export default {
  mongoUlr: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api',
  port: process.env.PORT || 5050,
  saltEncrypt: 12,
  jwtSecrect: process.env.JWT_SECRECT || 'TJ670==5hw'
}
