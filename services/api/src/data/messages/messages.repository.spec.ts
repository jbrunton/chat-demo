import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { DynamoDBAdapter } from '../adapters/dynamodb.adapter';
import { MessagesRepository } from './messages.repository';

describe('MessagesRepository', () => {
  let repository: MessagesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesRepository,
        {
          provide: DynamoDBAdapter,
          useValue: mock<DynamoDBAdapter>(),
        },
      ],
    }).compile();

    repository = module.get<MessagesRepository>(MessagesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
