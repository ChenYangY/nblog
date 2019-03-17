
module.exports = (app) => {
  app.get('/', (req, res) => {
    res.status(200).end('hello world')
  })
}
