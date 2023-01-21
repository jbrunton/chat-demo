import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '@nestjs/passport';
import { DBAdapter } from '@data/db.adapter';
import {
  fakeAuthUser,
  FakeAuthGuard,
  resetFakeAuthUsers,
  FakeAuth,
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
  let fakeAuth1: FakeAuth;
  let fakeAuth2: FakeAuth;

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

    fakeAuth1 = fakeAuthUser();
    fakeAuth2 = fakeAuthUser();
  });

  afterEach(() => {
    resetFakeAuthUsers();
  });

  it('has a health check', async () => {
    await request(app.getHttpServer()).get('/').expect(200).expect('OK');
  });

  it('stores and retrieves messages', async () => {
    const roomId = 'room_1';
    jest.setSystemTime(1001);

    await request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', `Bearer ${fakeAuth1.accessToken}`)
      .send({
        content: 'Hello Room 1, from User 1!',
        roomId,
      })
      .expect(201);

    jest.setSystemTime(1002);
    await request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', `Bearer ${fakeAuth2.accessToken}`)
      .send({
        content: 'Hello Room 1, from User 2!',
        roomId,
      })
      .expect(201);

    const { body } = await request(app.getHttpServer())
      .get(`/messages/${roomId}`)
      .set('Authorization', `Bearer ${fakeAuth1.accessToken}`)
      .expect(200);

    expect(body).toEqual({
      messages: [
        {
          id: 'msg_1001_a1b2c3',
          content: 'Hello Room 1, from User 1!',
          roomId: 'room_1',
          time: 1001,
          authorId: fakeAuth1.user.id,
        },
        {
          id: 'msg_1002_a1b2c3',
          content: 'Hello Room 1, from User 2!',
          roomId: 'room_1',
          time: 1002,
          authorId: fakeAuth2.user.id,
        },
      ],
      authors: {
        [fakeAuth1.user.id]: fakeAuth1.user,
        [fakeAuth2.user.id]: fakeAuth2.user,
      },
    });
  });
});
