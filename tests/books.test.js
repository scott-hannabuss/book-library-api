/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
    before(async () => Book.sequelize.sync());

    describe('with no records in the database', () => {
        describe('POST /books', () => {
            it('creates a new book in the database', async () => {
                const response = await request(app).post('/books').send({
                    title: 'Infinite Jest',
                });
                const newBookRecord = await Book.findByPk(response.body.id, {
                    raw: true,
                });

                expect(response.status).to.equal(201);
                expect(response.body.title).to.equal('Infinite Jest');
            });
        });

        it('fails if title is null', async () => {
            const response = await request(app).post('/books').send({
                title: null,
            });
            expect(response.status).to.equal(422);
            expect(response.body[0]).to.equal('Book.title cannot be null')
        });
    });
});


describe('with books in the database', () => {
    let books;

    beforeEach(async () => {
        await Book.destroy({ where: {} });

        books = await Promise.all([
            Book.create({
                title: 'Dune',
                ISBN: '9780',
            }),
            Book.create({
                title: 'Ulysses',
                ISBN: '1234',
            }),
            Book.create({
                title: 'Watchmen',
                ISBN: '9876',
            }),
        ]);
    });

    describe('GET /books', () => {
        it('gets all book records', async () => {
            const response = await request(app).get('/books');

            expect(response.status).to.equal(200);
            expect(response.body.length).to.equal(3);

            response.body.forEach((book) => {
                const expected = books.find((a) => a.id === book.id);

                expect(book.title).to.equal(expected.title);
            });
        });
    });

    describe('GET /books/:id', () => {
        it('gets book record by id', async () => {
            const book = books[0];
            const response = await request(app).get(`/books/${book.id}`);

            expect(response.status).to.equal(200);
            expect(response.body.title).to.equal(book.title);
        });

        it('returns a 404 if the book does not exist', async () => {
            const response = await request(app).get('/books/12345');

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The book could not be found.');
        });
    });

    describe('PATCH /books/:id', () => {
        it('updates book title by id', async () => {
            const book = books[0];
            const response = await request(app)
                .patch(`/books/${book.id}`)
                .send({ title: 'Dune Messiah' });
            const updatedBookRecord = await Book.findByPk(book.id, {
                raw: true,
            });

            expect(response.status).to.equal(200);
            expect(updatedBookRecord.title).to.equal('Dune Messiah');
        });

        it('returns a 404 if the book does not exist', async () => {
            const response = await request(app)
                .patch('/books/12345')
                .send({ title: 'New Book' });

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The book could not be found.');
        });
    });

    describe('DELETE /books/:id', () => {
        it('deletes book record by id', async () => {
            const book = books[0];
            const response = await request(app).delete(`/books/${book.id}`);
            const deletedBook = await Book.findByPk(book.id, { raw: true });

            expect(response.status).to.equal(204);
            expect(deletedBook).to.equal(null);
        });

        it('returns a 404 if the book does not exist', async () => {
            const response = await request(app).delete('/books/12345');
            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The book could not be found.');
        });
    });
});
