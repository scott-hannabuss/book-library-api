/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Book, Genre, Author, Reader } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
    let books;
    let genres;
    let authors;
    before(async () => {
        try {
            await Book.sequelize.sync();

        } catch (err) {
            console.log(err);
        }
    });
    beforeEach(async () => {
        try {
            await Book.destroy({ where: {} });
            await Genre.destroy({ where: {} });
            await Author.destroy({ where: {} })
            reader = await Reader.create({
                name: "Jane Doe",
                email: "J_Doe@email.com",
                password: "Password1"
            });
            genres = await Promise.all([
                Genre.create({ name: "Postmodern" }),
                Genre.create({ name: "Graphic Novel" }),
                Genre.create({ name: "Science Fiction" })
            ]);
            authors = await Promise.all([
                Author.create({ name: "David Foster Wallace" }),
                Author.create({ name: "Alan Moore" }),
                Author.create({ name: "Frank Herbert" })
            ])
            books = await Promise.all([
                Book.create({ title: "Infinite Jest", AuthorId: authors[0].id, GenreId: genres[0].id, ReaderId: reader.id, ISBN: "1234" }),
                Book.create({ title: "Watchmen", AuthorId: authors[1].id, GenreId: genres[1].id, ReaderId: reader.id, ISBN: "4321" }),
                Book.create({ title: "Dune", AuthorId: authors[2].id, GenreId: genres[2].id, ReaderId: reader.id, ISBN: "9876" }),
            ]);
        } catch (err) {
            console.log(err);
        }

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

    describe('GET /books', () => {
        it('gets all book records', async () => {
            const response = await request(app).get('/books');
            console.log(response);
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

