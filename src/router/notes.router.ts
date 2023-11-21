import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { NotesController } from '../controller/notes.controller.js';

const debug = createDebug('W7E:tasks:router');

export const notesRouter = createRouter();
debug('Starting');

const controller = new NotesController();

notesRouter.get('/', controller.getAll.bind(controller));
notesRouter.get('/search', controller.search.bind(controller));
notesRouter.get('/:id', controller.getById.bind(controller));
notesRouter.post('/', controller.create.bind(controller));
notesRouter.patch('/:id', controller.update.bind(controller));
// NotesRouter.patch('addUser/:id', controller.update.bind(controller));
// notesRouter.patch('removeUser/:id', controller.update.bind(controller));
notesRouter.delete('/:id', controller.delete.bind(controller));
