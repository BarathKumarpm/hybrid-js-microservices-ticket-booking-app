import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'; // Changed from import * as request
import { AppModule } from '../src/app.module';

describe('User API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST) - Should create a new user', () => {
    return request(app.getHttpServer()) // Now callable without error
      .post('/users')
      .send({ name: 'John Doe', email: 'john@example.com' })
      .expect(201)
      .then((response) => {
        expect(response.body.name).toEqual('John Doe');
        expect(response.body).toHaveProperty('id');
      });
  });

  it('/users (GET) - Should return array of users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});