import fs from 'fs/promises';
import { Hobbies } from '../entities/hobbies';
import { Repository } from './repo';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';

const debug = createDebug('W7E:tasks:file:repo');

export class HobbiesFileRepo implements Repository<Hobbies> {
  file: string;
  hobbies: Hobbies[];
  constructor() {
    debug('Instantiated');
    this.file = './data/data.json';
    this.hobbies = [];
    this.loadData();
  }

  private async loadData() {
    const data = await fs.readFile(this.file, { encoding: 'utf-8' });
    this.hobbies = JSON.parse(data);
  }

  async getAll(): Promise<Hobbies[]> {
    return this.hobbies;
  }

  async getById(id: string): Promise<Hobbies> {
    const result = this.hobbies.find((item) => item.id === id);
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  search({ _key, _value }: { _key: string; _value: unknown }): Promise<Hobbies[]> {
    // Temp this.hobbies.find((item) => item[_key] === _value)
    throw new Error('Method not implemented.');
  }

  async create(newItem: Omit<Hobbies, 'id'>): Promise<Hobbies> {
    const result: Hobbies = { ...newItem, id: crypto.randomUUID() };
    const newTasks = [...this.hobbies, result];
    await this.save(newTasks as Hobbies[]);
    return result;
  }

  async update(id: string, updatedItem: Partial<Hobbies>): Promise<Hobbies> {
    let result = this.hobbies.find((item) => item.id === id);
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    result = { ...result, ...updatedItem } as Hobbies;
    const newTasks = this.hobbies.map((item) => (item.id === id ? result : item));
    await this.save(newTasks as Hobbies[]);
    return result;
  }

  async delete(id: string): Promise<void> {
    const newTasks = this.hobbies.filter((item) => item.id !== id);
    if (newTasks.length === this.hobbies.length) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }

    await this.save(newTasks);
  }

  private async save(newHobbies: Hobbies[]) {
    await fs.writeFile(this.file, JSON.stringify(newHobbies), {
      encoding: 'utf-8',
    });
    this.hobbies = newHobbies;
  }
}
