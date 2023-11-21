import { NextFunction, Request, Response } from 'express';
import { HobbiesController } from './hobbies.controller';
import { HobbiesFileRepo } from '../repos/hobbies.file.repo';
import { Hobbies } from '../entities/hobbies';

describe('Given HobbiesController class', () => {
  describe('When calling getAll', () => {
    test('Then it should return the list of hobbies', async () => {
      const mockHobbies: Hobbies[] = [
        { id: '1', name: 'Hobby 1', topic: 'Topic 1', place: 'Place 1', picture: 'Picture 1' },
        { id: '2', name: 'Hobby 2', topic: 'Topic 2', place: 'Place 2', picture: 'Picture 2' },
      ];
      const repoMock = jest.spyOn(HobbiesFileRepo.prototype, 'getAll').mockResolvedValue(mockHobbies);
      const controller = new HobbiesController();
      const mockResponse: Partial<Response> = {
        json: jest.fn(),
      };
      await controller.getAll({} as Request, mockResponse as Response);
      expect(repoMock).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockHobbies);
    });
  });
  
  describe('When calling getById', () => {
    test('Then it should return the hobby with the specified ID', async () => {
      const mockHobby: Hobbies = { id: '1', name: 'Hobby 1', topic: 'Topic 1', place: 'Place 1', picture: 'Picture 1' };
      const repoMock = jest.spyOn(HobbiesFileRepo.prototype, 'getById').mockResolvedValue(mockHobby);
      const controller = new HobbiesController();
      const mockRequest: Partial<Request> = {
        params: { id: '1' },
      };

      const mockResponse: Partial<Response> = {
        json: jest.fn(),
      };

      await controller.getById(mockRequest as Request, mockResponse as Response, jest.fn());
      expect(repoMock).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockHobby);
    });

    test('Then it should handle errors and call the next function', async () => {
      const repoMock = jest.spyOn(HobbiesFileRepo.prototype, 'getById').mockRejectedValue(new Error('Test error'));
      const controller = new HobbiesController();
      const mockRequest: Partial<Request> = {
        params: { id: '1' },
      };

      const mockResponse: Partial<Response> = {
        json: jest.fn(),
      };
      
      const mockNext = jest.fn();
      await controller.getById(mockRequest as Request, mockResponse as Response, mockNext);
      expect(repoMock).toHaveBeenCalledWith('1');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('When calling create', () => {
    test('Then it should create a new hobby and return 201 status with the correct data', async () => {
      const mockNewHobby: Omit<Hobbies, 'id'> = { name: 'New Hobby', topic: 'Topic 1', place: 'Place 1', picture: 'Picture 1' };
      const mockCreatedHobby: Hobbies = { ...mockNewHobby, id: '1' };
      const repoMock = jest.spyOn(HobbiesFileRepo.prototype, 'create').mockResolvedValue(mockCreatedHobby);
      const controller = new HobbiesController();
      const mockRequest: Partial<Request> = {
        body: mockNewHobby,
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        statusMessage: '',
        json: jest.fn(),
      };

      await controller.create(mockRequest as Request, mockResponse as Response);
      expect(repoMock).toHaveBeenCalledWith(mockNewHobby);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.statusMessage).toBe('Created');
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedHobby);
    });

      describe('When update method should update a hobbie and return the updated data', () => {
        test('Then a valid ID and request body are provided', async () => {
          const mockId = '123';
          const mockRequestBody = { name: 'Updated Hobbie', topic: 'Updated Topic', place: 'Updated Place', picture: 'Updated Picture' };
          const mockUpdatedResult = {
            id: '123',
            name: 'Updated Hobbie',
            topic: 'Updated Topic',
            place: 'Updated Place',
            picture: 'Updated Picture',
          };
  
          const hobbiesFileRepoMock = jest.spyOn(HobbiesFileRepo.prototype, 'update').mockResolvedValue(mockUpdatedResult);
          const controller = new HobbiesController();
          const mockRequest: Request = {
            params: { id: mockId },
            body: mockRequestBody,
          } as unknown as Request;
  
          const mockResponse: Response = {
            json: jest.fn(),
          } as unknown as Response;
  
          const mockNext: NextFunction = jest.fn();
          await controller.update(mockRequest, mockResponse);
          expect(hobbiesFileRepoMock).toHaveBeenCalledWith(mockId, mockRequestBody);
          expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedResult);
          expect(mockNext).not.toHaveBeenCalled();
        });
  
      });

    });
 
    
    describe('Then delete method should delete a hobbie and return 204 status', () => {
      test('When a valid ID is provided', async () => {
        const mockId = '123';
        const hobbiesFileRepoMock = jest.spyOn(HobbiesFileRepo.prototype, 'delete').mockResolvedValue(undefined);
        const controller = new HobbiesController();
        const mockRequest: Request = {
          params: { id: mockId },
        } as unknown as Request;

        const mockResponse: Response = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as unknown as Response;

        const mockNext: NextFunction = jest.fn();
        await controller.delete(mockRequest, mockResponse, mockNext);
        expect(hobbiesFileRepoMock).toHaveBeenCalledWith(mockId);
        expect(mockResponse.status).toHaveBeenCalledWith(204);
        expect(mockResponse.json).toHaveBeenCalledWith({});
        expect(mockNext).not.toHaveBeenCalled(); // Ensure next function is not called on success
      });

      test('When an invalid ID is provided', async () => {
        const mockId = 'invalid_id';
        const mockError = new Error('Invalid ID');
        const hobbiesFileRepoMock = jest.spyOn(HobbiesFileRepo.prototype, 'delete').mockRejectedValue(mockError);
        const controller = new HobbiesController();
        const mockRequest: Request = {
          params: { id: mockId },
        } as unknown as Request;

        const mockResponse: Response = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as unknown as Response;

        const mockNext: NextFunction = jest.fn();
        await controller.delete(mockRequest, mockResponse, mockNext);
        expect(hobbiesFileRepoMock).toHaveBeenCalledWith(mockId);
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith(mockError);
      });
    });
  });


  
