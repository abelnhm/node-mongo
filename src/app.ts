import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { notesRouter } from './router/notes.router.js';
import createDebug from 'debug';

import { errorMiddleware } from './middleware/error.middleware.js';
import { hobbiesRouter } from './router/hobbies.router.js';

const debug = createDebug('W7E:app');

export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('public'));

app.use('/hobbies', hobbiesRouter);
app.use('/notes', notesRouter);

app.use(errorMiddleware);
