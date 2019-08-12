require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const foldersRouter = require('./folders/folders-router')
const notesRouter = require('./notes/note-router')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common'))
app.use(cors())
app.options('*', cors())
app.use(helmet())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

    app.use('/api/folders', foldersRouter)

    app.use('/api/notes', notesRouter)



app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    } 
    console.log(error)
    // res.status(500).json(response)
})


module.exports = app