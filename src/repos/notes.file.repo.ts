import fs from 'fs/promises';
import { Note } from '../entities/notes';
import { Repository } from './repo';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';

const debug = createDebug('W7E:notes:file:repo');

export class NotesFileRepo implements Repository<Note> {
  file: string;
  notes: Note[];
  constructor() {
    debug('Instantiated');
    this.file = './data/notes.json';
    this.notes = [];
    this.loadData();
  }

  private async loadData() {
    const data = await fs.readFile(this.file, { encoding: 'utf-8' });
    this.notes = JSON.parse(data);
  }

  async getAll(): Promise<Note[]> {
    return this.notes;
  }

  async getById(id: string): Promise<Note> {
    const result = this.notes.find((item) => item.id === id);
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  search({ _key, _value }: { _key: string; _value: unknown }): Promise<Note[]> {
    // Temp this.notes.find((item) => item[_key] === _value)
    throw new Error('Method not implemented.');
  }

  async create(newItem: Omit<Note, 'id'>): Promise<Note> {
    const result: Note = { ...newItem, id: crypto.randomUUID() };
    const newNotes = [...this.notes, result];
    await this.save(newNotes as Note[]);
    return result;
  }

  async update(id: string, updatedItem: Partial<Note>): Promise<Note> {
    let result = this.notes.find((item) => item.id === id);
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    result = { ...result, ...updatedItem } as Note;
    const newNotes = this.notes.map((item) => (item.id === id ? result : item));
    await this.save(newNotes as Note[]);
    return result;
  }

  async delete(id: string): Promise<void> {
    const newNotes = this.notes.filter((item) => item.id !== id);
    if (newNotes.length === this.notes.length) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }

    await this.save(newNotes);
  }

  private async save(newnotes: Note[]) {
    await fs.writeFile(this.file, JSON.stringify(newnotes), {
      encoding: 'utf-8',
    });
    this.notes = newnotes;
  }
}
