import { Schema, model } from 'mongoose';
import { Note } from '../entities/notes';

// Crear el modelo de datos
const notesSchema = new Schema<Note>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  isImportant: {
    type: Boolean,
    default: false,
  },
});

// Explicación de la siguiente línea:
/*
  set es un método de mongoose que permite modificar el comportamiento de un modelo.
  toJSON es un método que se ejecuta cuando se serializa un documento a JSON.
  transform es un método que permite modificar el objeto que se serializa.
  _doc es el documento que se serializa.
  returnedObject es el objeto que se devuelve.
  delete returnedObject._id; elimina la propiedad _id del objeto que se devuelve.
  delete returnedObject.__v; elimina la propiedad __v del objeto que se devuelve.
  delete returnedObject.passwd; elimina la propiedad passwd del objeto que se devuelve.
*/

notesSchema.set('toJSON', {
  transform(_doc, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

export const NoteModel = model<Note>('Note', notesSchema, 'notes');
