const {
    getAllGenresorAuthors,
    createItem,
    updateItem,
    deleteItem,
    getGenreorAuthorById,
} = require('./helpers');

const getGenres = (_, res) => getAllGenresorAuthors(res, 'genre');

const createGenre = (req, res) => createItem(res, 'genre', req.body);

const updateGenre = (req, res) => updateItem(res, 'genre', req.body, req.params.id);

const getGenre = (req, res) => getGenreorAuthorById(res, 'genre', req.params.id);

const deleteGenre = (req, res) => deleteItem(res, 'genre', req.params.id);

module.exports = {
    getGenres,
    getGenre,
    createGenre,
    updateGenre,
    deleteGenre,
}