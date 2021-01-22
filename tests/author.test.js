/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Author } = require('../src/models');
const app = require('../src/app');

describe('/authors', () => {
    before(async () => Author.sequelize.sync());

    describe('with no records in the database', () => {
        describe('POST /authors', () => {
            it('creates a new author in the database', async () => {
                const response = await request(app).post('/authors').send({
                    name: 'David Foster Wallace',
                });
                const newAuthorRecord = await Author.findByPk(response.body.id, {
                    raw: true,
                });
                expect(response.status).to.equal(201);
                expect(response.body.name).to.equal('David Foster Wallace');
            });
        });
    });
});

describe('with records in the database', () => {
    let authors;

    beforeEach(async () => {
        await Author.destroy({ where: {} });

        authors = await Promise.all([
            Author.create({
                name: 'David Foster Wallace',
            }),
            Author.create({ name: 'Frank Herbert' }),
            Author.create({ name: 'Don DeLillo' }),
        ]);
    });

    describe('GET /authors', () => {
        it('gets all author records', async () => {
            const response = await request(app).get('/authors');

            expect(response.status).to.equal(200);
            expect(response.body.length).to.equal(3);

            response.body.forEach((author) => {
                const expected = authors.find((a) => a.id === author.id);

                expect(author.name).to.equal(expected.name);
            });
        });
    });

    describe('GET /authors/:id', () => {
        it('gets author record by id', async () => {
            const author = authors[0];
            const response = await request(app).get(`/authors/${author.id}`);

            expect(response.status).to.equal(200);
            expect(response.body.name).to.equal(author.name);
        });

        it('returns a 404 if the author does not exist', async () => {
            const response = await request(app).get('/authors/12345');

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The author could not be found.');
        });
    });

    describe('PATCH /authors/:id', () => {
        it('updates authors name by id', async () => {
            const author = authors[0];
            const response = await request(app)
                .patch(`/authors/${author.id}`)
                .send({ name: 'Charles Dickens' });
            const updatedAuthorRecord = await Author.findByPk(author.id, {
                raw: true,
            });

            expect(response.status).to.equal(200);
            expect(updatedAuthorRecord.name).to.equal('Charles Dickens');
        });

        it('returns a 404 if the author does not exist', async () => {
            const response = await request(app)
                .patch('/authors/12345')
                .send({ name: 'New Author' });

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The author could not be found.');
        });
    });

    describe('DELETE /authors/:id', () => {
        it('deletes author record by id', async () => {
            const author = authors[0];
            const response = await request(app).delete(`/authors/${author.id}`);
            const deletedAuthor = await Author.findByPk(author.id, { raw: true });

            expect(response.status).to.equal(204);
            expect(deletedAuthor).to.equal(null);
        });

        it('returns a 404 if the author does not exist', async () => {
            const response = await request(app).delete('/authors/12345');
            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The author could not be found.');
        });
    });
});