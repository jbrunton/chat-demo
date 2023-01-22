import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { AuthGuard } from '@nestjs/passport';
import {
  fakeAuthUser,
  FakeAuthGuard,
  resetFakeAuthUsers,
  FakeAuth,
} from '@fixtures/auth/FakeAuth';
import { map, omit } from 'rambda';
import { Message } from '@entities/message.entity';

jest.mock('@app/auth/auth0/auth0.client');

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let fakeAuth1: FakeAuth;
  let fakeAuth2: FakeAuth;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(FakeAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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

    const removeIds = (messages: Message[]) =>
      map((msg) => omit(['id'], msg), messages);

    expect(removeIds(body.messages)).toEqual([
      {
        content: 'Hello Room 1, from User 1!',
        roomId: 'room_1',
        time: 1001,
        authorId: fakeAuth1.user.id,
      },
      {
        content: 'Hello Room 1, from User 2!',
        roomId: 'room_1',
        time: 1002,
        authorId: fakeAuth2.user.id,
      },
    ]);
    expect(body.authors).toEqual({
      [fakeAuth1.user.id]: fakeAuth1.user,
      [fakeAuth2.user.id]: fakeAuth2.user,
    });
  });
});
