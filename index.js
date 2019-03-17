const express = require('express')
const session = require('express-session')
const RedisSotre = require('connect-redis')(session)
const config = require('config-lite')

const flash = require('connect-flash')
const expressWinston = require('express-winston')
const winston = require('winston')
const path = require('path')

const routes = require('./routes')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())

app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: config.session.maxAge
  },
  sotre: new RedisSotre({
    url: config.redis
  })
}))

app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}))

routes(app)

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}))

app.listen(config.port, () => {
  console.log(`server start at ${config.port}`)
})
