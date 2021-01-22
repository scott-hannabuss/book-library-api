/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');

describe('/genres', () => {
    before(async () => Genre.sequelize.sync());

    describe('with no records in the database', () => {
        describe('POST /genres', () => {
            it('creates a new genre in the database', async () => {
                const response = await request(app).post('/genres').send({
                    name: 'Science Fiction',
                });
                const newGenreRecord = await Genre.findByPk(response.body.id, {
                    raw: true,
                });
                expect(response.status).to.equal(201);
                expect(response.body.name).to.equal('Science Fiction');
            });
        });
    });
});

describe('with records in the database', () => {
    let genres;

    beforeEach(async () => {
        await Genre.destroy({ where: {} });

        genres = await Promise.all([
            Genre.create({
                name: 'Fantasy',
            }),
            Genre.create({ name: 'Postmodern' }),
            Genre.create({ name: 'Gothic' }),
        ]);
    });

    describe('GET /genres', () => {
        it('gets all genre records', async () => {
            const response = await request(app).get('/genres');

            expect(response.status).to.equal(200);
            expect(response.body.length).to.equal(3);

            response.body.forEach((genre) => {
                const expected = genres.find((a) => a.id === genre.id);

                expect(genre.name).to.equal(expected.name);
            });
        });
    });

    describe('GET /genres/:id', () => {
        it('gets genre record by id', async () => {
            const genre = genres[0];
            const response = await request(app).get(`/genres/${genre.id}`);

            expect(response.status).to.equal(200);
            expect(response.body.name).to.equal(genre.name);
        });

        it('returns a 404 if the genre does not exist', async () => {
            const response = await request(app).get('/genres/12345');

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The genre could not be found.');
        });
    });

    describe('PATCH /genre/:id', () => {
        it('updates genre name by id', async () => {
            const genre = genres[0];
            const response = await request(app)
                .patch(`/genres/${genre.id}`)
                .send({ name: 'Victorian' });
            const updatedGenreRecord = await Genre.findByPk(genre.id, {
                raw: true,
            });

            expect(response.status).to.equal(200);
            expect(updatedGenreRecord.name).to.equal('Victorian');
        });

        it('returns a 404 if the genre does not exist', async () => {
            const response = await request(app)
                .patch('/genres/12345')
                .send({ name: 'New Genre' });

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The genre could not be found.');
        });
    });

    describe('DELETE /genres/:id', () => {
        it('deletes genre record by id', async () => {
            const genre = genres[0];
            const response = await request(app).delete(`/genres/${genre.id}`);
            const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

            expect(response.status).to.equal(204);
            expect(deletedGenre).to.equal(null);
        });

        it('returns a 404 if the genre does not exist', async () => {
            const response = await request(app).delete('/genres/12345');
            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The genre could not be found.');
        });
    });
});