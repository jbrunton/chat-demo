import { Test, TestingModule } from '@nestjs/testing';
import { MessagesRepository } from '../data/messages/messages.repository';
import { UsersRepository } from '../data/users/users.repository';
import { MessagesService } from './messages.service';
import { mock } from 'jest-mock-extended';

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: UsersRepository, useValue: mock<UsersRepository>() },
        { provide: MessagesRepository, useValue: mock<MessagesRepository>() },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
