import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { NomineesModule } from 'src/modules/nominees/nominees.module';

describe('NomineeController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [NomineesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/awards-intervals (GET)', () => {
    return request(app.getHttpServer())
      .get('/nominees/awards-intervals')
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject(expect.objectContaining({
          min: expect.arrayContaining([expect.objectContaining({
            producer: expect.any(String),
            interval: expect.any(Number),
            previousWin: expect.any(Number),
            followingWin: expect.any(Number),
          })]), 
          max: expect.arrayContaining([expect.objectContaining({
            producer: expect.any(String),
            interval: expect.any(Number),
            previousWin: expect.any(Number),
            followingWin: expect.any(Number),
          })])
        }));
      });
  });
});
