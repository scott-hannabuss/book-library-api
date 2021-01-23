const {
    getAllBooks,
    createItem,
    updateItem,
    getBookById,
    deleteItem,
} = require('./helpers');

const getBooks = (_, res) => getAllBooks(res, 'book');

const createBook = (req, res) => createItem(res, 'book', req.body);

const updateBook = (req, res) => updateItem(res, 'book', req.body, req.params.id);

const getBook = (req, res) => getBookById(res, 'book', req.params.id);

const deleteBook = (req, res) => deleteItem(res, 'book', req.params.id);

module.exports = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
}