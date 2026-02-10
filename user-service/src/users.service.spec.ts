import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersServiceMock: {
    create: jest.Mock;
    findAll: jest.Mock;
  };

  beforeEach(async () => {
    usersServiceMock = {
      create: jest.fn((u: Partial<User>) => ({ id: 1, ...u })),
      findAll: jest.fn(() => [{ id: 1, name: 'Alice' }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  describe('create', () => {
    it('calls usersService.create and returns created user', () => {
      const dto: Partial<User> = { name: 'Bob' };
      const result = usersController.create(dto);
      expect(usersServiceMock.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('returns list of users from usersService.findAll', () => {
      const result = usersController.findAll();
      expect(usersServiceMock.findAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1, name: 'Alice' }]);
    });
  });
});
