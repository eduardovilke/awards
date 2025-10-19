import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { Nominee } from 'src/modules/nominees/entities/nominee.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';

describe('NomineeController (e2e)', () => {
  let app: INestApplication<App>;
  let nomineeRepository: Repository<Nominee>;
  let nomineeIdToDelete: string;
  let nomineeIdToUpdate: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    nomineeRepository = moduleFixture.get<Repository<Nominee>>(
      getRepositoryToken(Nominee),
    );

    const nominee = await nomineeRepository.find({ take: 2 });
    nomineeIdToDelete = nominee[0].id;
    nomineeIdToUpdate = nominee[1].id;
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

  describe('/nominees/:id (GET)', () => {
    describe('When the nominee exists', () => {
      it('Should return the nominee', () => {
        return request(app.getHttpServer())
          .get(`/nominees/${nomineeIdToDelete}`)
          .expect(200)
          .expect((response) => {
            expect(response.body).toMatchObject(
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
            );
          });
      });
    });
    describe('When the nominee does not exist', () => {
      it('Should return a 404 error', () => {
        return request(app.getHttpServer())
          .get(`/nominees/non-existing-id`)
          .expect(404)
          .expect((response) => {
            expect(response.body).toMatchObject(
              expect.objectContaining({
                statusCode: 404,
                message: `Nominee with id non-existing-id not found`,
                error: 'Not Found',
              }),
            );
          });
      });
    });
  });

  describe('/nominees/:id  (DELETE)', () => {
    it('Should soft delete the nominee', async () => {
      return request(app.getHttpServer())
        .delete(`/nominees/${nomineeIdToDelete}`)
        .expect(200)
        .then(async () => {
          const deletedNominee = await nomineeRepository.findOne({
            where: { id: nomineeIdToDelete },
            withDeleted: true,
          });
          expect(deletedNominee).toBeDefined();
          expect(deletedNominee.deletedAt).toBeInstanceOf(Date);
        });
    });
  });

  describe('/nominees/:id  (PUT)', () => {
    describe('When the nominee does not exist', () => {
      it('Should return a 404 error', () => {
        const updateData = {
          title: 'Updated Movie Title',
          year: 2025,
          isWinner: true,
        };

        return request(app.getHttpServer())
          .put(`/nominees/non-existing-id`)
          .send(updateData)
          .expect(404)
          .expect((response) => {
            expect(response.body).toMatchObject(
              expect.objectContaining({
                statusCode: 404,
                message: `Nominee non-existing-id not found`,
                error: 'Not Found',
              }),
            );
          });
      });
    });

    describe('When the nominee exists', () => {
      it('Should update the nominee', () => {
        const updateData = {
          title: 'Updated Movie Title',
          year: 2025,
          isWinner: true,
        };

        return request(app.getHttpServer())
          .put(`/nominees/${nomineeIdToUpdate}`)
          .send(updateData)
          .expect(200)
          .expect((response) => {
            expect(response.body).toMatchObject(
              expect.objectContaining({
                id: nomineeIdToUpdate,
                title: updateData.title,
                year: updateData.year,
                isWinner: updateData.isWinner,
              }),
            );
          });
      });
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
