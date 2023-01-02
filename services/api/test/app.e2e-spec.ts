import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '@nestjs/passport';
import { DBAdapter } from '@data/db.adapter';
import {
  fakeAuthUser,
  FakeAuthGuard,
  resetFakeAuthUsers,
} from '@fixtures/auth/FakeAuth';

jest.mock('@lib/auth/auth0/auth0.client');

jest.mock('@lib/util', () => {
  return {
    getRandomString: () => 'a1b2c3',
  };
});

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let db: DBAdapter;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(FakeAuthGuard)
      .compile();

    db = moduleFixture.get(DBAdapter);
    await db.create();
    await db.waitForTable(60);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await db.waitForTable(60);
    await db.destroy();
  });

  beforeEach(async () => {
    jest.useFakeTimers();

    fakeAuthUser('user-1-token', {
      sub: 'user-1',
      name: 'User 1',
      picture: 'https://example.com/user1.png',
    });

    fakeAuthUser('user-2-token', {
      sub: 'user-2',
      name: 'User 2',
      picture: 'https://example.com/user2.png',
    });
  });

  afterEach(() => {
    resetFakeAuthUsers();
  });

  it('has a health check', async () => {
    await request(app.getHttpServer()).get('/').expect(200).expect('OK');
  });

  it('stores and retrieves messages', async () => {
    jest.setSystemTime(1001);
    await request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', 'Bearer user-1-token')
      .send({
        content: 'Hello Room 1, from User 1!',
        roomId: '1',
      })
      .expect(201);

    jest.setSystemTime(1002);
    await request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', 'Bearer user-2-token')
      .send({
        content: 'Hello Room 1, from User 2!',
        roomId: '1',
      })
      .expect(201);

    await request(app.getHttpServer())
      .get('/messages/1')
      .set('Authorization', 'Bearer user-1-token')
      .expect(200, {
        messages: [
          {
            id: 'Msg#1001#a1b2c3',
            content: 'Hello Room 1, from User 1!',
            roomId: '1',
            time: 1001,
            authorId: 'User#user-1',
          },
          {
            id: 'Msg#1002#a1b2c3',
            content: 'Hello Room 1, from User 2!',
            roomId: '1',
            time: 1002,
            authorId: 'User#user-2',
          },
        ],
        authors: {
          'User#user-1': {
            id: 'User#user-1',
            name: 'User 1',
            picture: 'https://example.com/user1.png',
          },
          'User#user-2': {
            id: 'User#user-2',
            name: 'User 2',
            picture: 'https://example.com/user2.png',
          },
        },
      });
  });
});
