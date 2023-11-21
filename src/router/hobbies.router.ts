import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { HobbiesController } from '../controller/hobbies.controller.js';

const debug = createDebug('W7E:tasks:router');

export const hobbiesRouter = createRouter();
debug('Starting');

const controller = new HobbiesController();

hobbiesRouter.get('/', controller.getAll.bind(controller));
hobbiesRouter.get('/search', controller.search.bind(controller));
hobbiesRouter.get('/:id', controller.getById.bind(controller));
hobbiesRouter.post('/', controller.create.bind(controller));
hobbiesRouter.patch('/:id', controller.update.bind(controller));
hobbiesRouter.patch('addUser/:id', controller.update.bind(controller));
hobbiesRouter.patch('removeUser/:id', controller.update.bind(controller));
hobbiesRouter.delete('/:id', controller.delete.bind(controller));
