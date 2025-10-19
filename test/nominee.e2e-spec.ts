import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { NomineesModule } from 'src/modules/nominees/nominees.module';
import { Nominee } from 'src/modules/nominees/entities/nominee.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/config/database/database.module';
import { nomineeProviders } from 'src/modules/nominees/nominee.providers';

describe('NomineeController (e2e)', () => {
  let app: INestApplication<App>;
  let nomineeRepository: Repository<Nominee>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [NomineesModule],
    }).compile();


    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    nomineeRepository = moduleFixture.get<Repository<Nominee>>(getRepositoryToken(Nominee));
    const nomineeCount = await nomineeRepository.count();
    console.log('nomineeCount :>> ', nomineeCount);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/nominees (GET)', () => {
    return request(app.getHttpServer())
      .get('/nominees')
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject(
          expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                year: expect.any(Number),
                title: expect.any(String),
                isWinner: expect.any(Boolean),
                producers: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.any(String),
                    name: expect.any(String),
                  }),
                ]),
                studios: expect.arrayContaining([
                  expect.objectContaining({
                    id: expect.any(String),
                    name: expect.any(String),
                  }),
                ]),
              }),
            ]),
            total: expect.any(Number),
            page: expect.any(Number),
            limit: expect.any(Number),
            totalPages: expect.any(Number),
          }),
        );
      });
  });

  it('/awards-intervals (GET)', () => {
    return request(app.getHttpServer())
      .get('/nominees/awards-intervals')
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject(
          expect.objectContaining({
            min: expect.arrayContaining([
              expect.objectContaining({
                producer: expect.any(String),
                interval: expect.any(Number),
                previousWin: expect.any(Number),
                followingWin: expect.any(Number),
              }),
            ]),
            max: expect.arrayContaining([
              expect.objectContaining({
                producer: expect.any(String),
                interval: expect.any(Number),
                previousWin: expect.any(Number),
                followingWin: expect.any(Number),
              }),
            ]),
          }),
        );
      });
  });
});
