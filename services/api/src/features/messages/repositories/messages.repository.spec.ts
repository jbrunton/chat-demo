import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { DBAdapter } from '@data/db.adapter';
import { MessagesRepository } from './messages.repository';

describe('MessagesRepository', () => {
  let repository: MessagesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesRepository,
        {
          provide: DBAdapter,
          useValue: mock<DBAdapter>(),
        },
      ],
    }).compile();

    repository = module.get<MessagesRepository>(MessagesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
