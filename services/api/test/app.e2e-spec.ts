import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '@nestjs/passport';
import { CanActivate } from '@nestjs/common';
import { PermissionsGuard } from '@lib/auth/permissions/permissions.guard';
import { UserInfo } from '@lib/auth/user-profile/user-info';
import { DynamoDBAdapter } from '@data/adapters/dynamodb.adapter';
import { DBAdapter } from '@data/db.adapter';

const fakeGuard: CanActivate = { canActivate: () => true };

jest.mock('@lib/auth/auth0/auth0.client', () => {
  return {
    client: {
      async getProfile(token: string): Promise<UserInfo> {
        return {
          sub: 'google-1',
          name: 'User',
          picture: 'https://example.com/user1.png',
        };
      },
    },
  };
});

jest.mock('@lib/util', () => {
  return {
    getRandomString: () => 'a1b2c3',
  };
});

describe('AppController (e2e)', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;
  let db: DBAdapter;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(fakeGuard)
      .overrideGuard(PermissionsGuard)
      .useValue(fakeGuard)
      .compile();

    db = moduleFixture.get(DBAdapter);
    await db.create();
    await db.waitForTable(60);
  });

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(1001);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await db.waitForTable(60);
    await db.destroy();
  });

  it('has a health check', async () => {
    await request(app.getHttpServer()).get('/').expect(200).expect('OK');
  });

  it('stores and retrieves messages', async () => {
    await request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', 'Bearer test-valid-token')
      .send({
        content: 'Hello!',
        roomId: '1',
      })
      .expect(201, {
        id: 'Msg#1001#a1b2c3',
        content: 'Hello!',
        roomId: '1',
        time: 1001,
        authorId: 'User#google-1',
      });

    await request(app.getHttpServer())
      .get('/messages/1')
      .set('Authorization', 'Bearer test-valid-token')
      .expect(200, {
        messages: [
          {
            id: 'Msg#1001#a1b2c3',
            content: 'Hello!',
            roomId: '1',
            time: 1001,
            authorId: 'User#google-1',
          },
        ],
        authors: {
          'User#google-1': {
            id: 'User#google-1',
            name: 'User',
            picture: 'https://example.com/user1.png',
          },
        },
      });
  });
});
