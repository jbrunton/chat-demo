import { Test } from '@nestjs/testing';
import { ConsoleLogger, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthGuard } from '@nestjs/passport';
import {
  fakeAuthUser,
  FakeAuthGuard,
  resetFakeAuthUsers,
  FakeAuth,
  FakeAuth0Client,
} from '@fixtures/auth/FakeAuth';
import { map, omit } from 'rambda';
import { Message } from '@entities/message.entity';
import { MainModule } from '../src/main.module';
import { Auth0Client } from '@app/auth/auth0/auth0.client';
import { mock } from 'jest-mock-extended';
import { AppLogger } from '@app/app.logger';

jest.mock('@app/auth/auth0/auth0.client');

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let fakeAuth1: FakeAuth;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [MainModule],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(FakeAuthGuard)
      .overrideProvider(Auth0Client)
      .useClass(FakeAuth0Client)
      .overrideProvider(ConsoleLogger)
      .useValue(mock<AppLogger>())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    jest.useFakeTimers();

    fakeAuth1 = fakeAuthUser();
  });

  afterEach(() => {
    resetFakeAuthUsers();
  });

  it('has a health check', async () => {
    await request(app.getHttpServer()).get('/').expect(200).expect('OK');
  });

  it('stores and retrieves messages', async () => {
    jest.setSystemTime(1001);

    const roomResponse = await request(app.getHttpServer())
      .post('/rooms')
      .set('Authorization', `Bearer ${fakeAuth1.accessToken}`)
      .send()
      .expect(201);

    const roomId = roomResponse.body.room.id;

    await request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', `Bearer ${fakeAuth1.accessToken}`)
      .send({
        content: 'Hello Room 1, from User 1!',
        roomId,
      })
      .expect(201);

    const { body } = await request(app.getHttpServer())
      .get(`/messages/${roomId}`)
      .set('Authorization', `Bearer ${fakeAuth1.accessToken}`)
      .expect(200);

    const removeIds = (messages: Message[]) =>
      map((msg) => omit(['id'], msg), messages);

    expect(removeIds(body)).toEqual([
      {
        content: 'Hello Room 1, from User 1!',
        roomId,
        time: 1001,
        authorId: fakeAuth1.user.id,
      },
    ]);
  });
});
