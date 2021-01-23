const {
    getAllGenresorAuthors,
    createItem,
    updateItem,
    getGenreorAuthorById,
    deleteItem,
} = require('./helpers');

const getAuthors = (_, res) => getAllGenresorAuthors(res, 'author');

const createAuthor = (req, res) => createItem(res, 'author', req.body);

const updateAuthor = (req, res) => updateItem(res, 'author', req.body, req.params.id);

const getAuthor = (req, res) => getGenreorAuthorById(res, 'author', req.params.id);

const deleteAuthor = (req, res) => deleteItem(res, 'author', req.params.id);

module.exports = {
    getAuthors,
    getAuthor,
    createAuthor,
    updateAuthor,
    deleteAuthor
}