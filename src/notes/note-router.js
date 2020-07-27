const path = require('path')
const express = require('express')
const xss = require('xss')
const NotesServices = require('./notes-service')

const NotesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
  id: note.id,
  name: xss(note.name), 
  modified: note.modified,
  folder_id: note.folder_id,
  content: xss(note.content),
})

NotesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesServices.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes.map(serializeNote))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, modified, folder_id, content } = req.body
    const newNote = { name, folder_id, content }

    for (const [key, value] of Object.entries(newNote))
      if (value == null)
        return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }   
        })
    newNote.modified = modified;

    NotesServices.insertNote(
        req.app.get('db'),
        newNote
    )
        .then(note => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${note.id}`))
            .json(serializeNote(note))
        })
        .catch(next)
  })

NotesRouter
  .route('/:note_id')
  .all((req, res, next) => {
      NotesServices.getById(
        req.app.get('db'),
        req.params.note_id
      )
        .then(note => {
          if (!note) {
            return res.status(404).json({
                error: { message: `Note doesn't exist` }
            })
          }
          res.note = note
          next()
        })
        .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note))
  })
  .delete((req, res, next) => {
    NotesServices.deleteNotes(
        req.app.get('db'),
        req.params.note_id
    )
        .then(numsRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
      const { name, folder_id, content } = req.body
      const noteToUpdate = { name, folder_id, content }
      
      const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
      if (numberOfValues === 0)
        return res.status(400).json({
            error: { 
                message: `Request body must content either 'name', 'folder_id' or 'content'`
            }
        })
      NotesServices.updateNote(
          req.app.get('db'),
          req.params.note_id,
          noteToUpdate
      )
        .then(numsRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = NotesRouter