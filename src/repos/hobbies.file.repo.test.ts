import { HobbiesFileRepo } from './hobbies.file.repo';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('Given HobbiesFileRepo class', () => {
  describe('When we instantiate it', () => {
    const mockData = '[{"name": "Test"}]';
    fs.readFile = jest.fn().mockResolvedValue(mockData);
    fs.writeFile = jest.fn();
    const repo = new HobbiesFileRepo();

    test('Then getAll should ...', async () => {
      const result = await repo.getAll();
      expect(result).toStrictEqual(JSON.parse(mockData));
    });
  });

  describe('When we instantiate it', () => {
    let repo: HobbiesFileRepo;
    beforeEach(() => {
      repo = new HobbiesFileRepo();
    });

    test('then should retrieve hobby by ID', async () => {
      const allHobbies = await repo.getAll();
      const hobbyToTest = allHobbies[0];
      const result = await repo.getById(hobbyToTest.id);
      expect(result).toEqual(hobbyToTest);
    });
  
    test('then should throw an error for non-existing ID', async () => {
      const nonExistingId = 'non-existing-id';
      await expect(repo.getById(nonExistingId)).rejects.toThrow('GetById not possible');
    });
  });


  describe('when we create:', () => {
    let repo: HobbiesFileRepo;
  
    beforeEach(() => {
      repo = new HobbiesFileRepo();
    });
  
    test('then it should create a new hobby', async () => {
      const newItem = {
        topic: 'New Topic',
        name: 'New Hobby',
        place: 'New Place',
        picture: 'path/to/image.jpg',
      };
  
      const createdHobby = await repo.create(newItem);
      expect(createdHobby).toMatchObject(newItem);
      const allHobbies = await repo.getAll();
      expect(allHobbies).toContainEqual(createdHobby);
    });
  });

  describe('when update', () => {
    let repo: HobbiesFileRepo;
  
    beforeEach(() => {
      repo = new HobbiesFileRepo();
    });
  
    it('should update an existing hobby', async () => {

      const allHobbies = await repo.getAll();
      const hobbyToUpdate = allHobbies[0];
  
      const updatedProperties = {
        name: 'Updated Hobby Name',
        place: 'Updated Place',
        picture: 'path/to/updated-image.jpg',
      };
  
      const updatedHobby = await repo.update(hobbyToUpdate.id, updatedProperties);
  
      expect(updatedHobby).toMatchObject({
        ...hobbyToUpdate, // Ensure existing properties are retained
        ...updatedProperties,
      });
  
      const updatedHobbiesList = await repo.getAll();
      expect(updatedHobbiesList).toContainEqual(updatedHobby);
      expect(updatedHobbiesList).not.toContainEqual(hobbyToUpdate);
    });
  
    it('should throw an error for updating a non-existing hobby', async () => {
      const nonExistingId = 'non-existing-id';
      const updatedProperties = {
        name: 'Updated Hobby Name',
        place: 'Updated Place',
        picture: 'path/to/updated-image.jpg',
      };
  
      await expect(repo.update(nonExistingId, updatedProperties)).rejects.toThrow('Update not possible');
    });
  });
  
  describe('When we delete:', () => {
    let repo: HobbiesFileRepo;
  
    beforeEach(() => {
      repo = new HobbiesFileRepo();
    });
  
    it('should delete an existing hobby', async () => {
      const allHobbies = await repo.getAll();
      const hobbyToDelete = allHobbies[0];
      await repo.delete(hobbyToDelete.id);
      const updatedHobbiesList = await repo.getAll();
      expect(updatedHobbiesList).not.toContainEqual(hobbyToDelete);
    });
  
    it('should throw an error for deleting a non-existing hobby', async () => {
      const nonExistingId = 'non-existing-id';
      await expect(repo.delete(nonExistingId)).rejects.toThrow('Delete not possible');
    });
  });
  

  });
