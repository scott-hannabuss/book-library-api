const express = require('express');

const router = express.Router();
const genreController = require('../controllers/genre');

router
    .route('/')
    .get(genreController.getGenres)
    .post(genreController.createGenre);

router
    .route('/:id')
    .get(genreController.getGenre)
    .patch(genreController.updateGenre)
    .delete(genreController.deleteGenre);

module.exports = router;