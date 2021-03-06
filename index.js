const cheerio = require('cheerio')
const request = require('request')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const inject = require('./inject')
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('static'))

app.get('/', (req, res) => {
  request.jar()
  request('http://w1131323.ferozo.com/wonderfood/frmAltaPedidos.aspx', (err, response, body) => {
    const $ = cheerio.load(body)
    $('head').append(`
      <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimal-ui" />
      <style>
        @import url('https://fonts.googleapis.com/css?family=Slabo+27px');
      </style>
    `)
    $('title').text('CheleWonder ;)')
    $('body').append(`<script>(${inject.toString()})()</script>`)
    res.send($.html())
  })
})

app.get('/Styles/:file', (req, res) => {
  const { file } = req.params
  request(`http://w1131323.ferozo.com/wonderfood/Styles/${file}`, (err, response, body) => {
    res.set('Content-Type', 'text/css')
    res.send(body)
  })
})

app.post('/Login.aspx', (req, res) => {
  const jar = request.jar()

  request.post(
    { url: 'http://w1131323.ferozo.com/wonderfood/Login.aspx', form: req.body, jar },
    (err, response, body) => {
      request(
        {
          url: 'http://w1131323.ferozo.com/wonderfood/frmAltaPedidos.aspx',
          jar
        },
        (err, response, body) => {
          const $ = cheerio.load(body)
          $('head').append(`
          <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimal-ui" />
            <style>
              @import url('https://fonts.googleapis.com/css?family=Roboto+Slab');
            </style>
          `)
          $('title').text('CheleWonder ;)')
          $('body').append(`<script>(${inject.toString()})()</script>`)
          res.send($.html())
        }
      )
    }
  )
})

app.listen(port)
