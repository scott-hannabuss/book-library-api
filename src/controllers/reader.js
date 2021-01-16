const { Reader } = require('../models');

const getReaders = (_, res) => {
  Reader.findAll().then(readers => {
    res.status(200).json(readers);
  });
}

const createReader = (req, res) => {
  const newReader = req.body;
  Reader
    .create(newReader)
    .catch(error => {
      console.log(error)
      if (error.errors.ValidationErrorItem.message === 'Password is not valid') {
        res.status(404).json({ error: 'Password must be at least 9 characters' });
      }
      else (error.errors.ValidationErrorItem.message === 'Validation isEmail on email failed') {
        res.status(404).json({ error: 'Email must be valid email format' });
      }
    })
    .then(newReaderCreated => {
      res.status(201).json(newReaderCreated)
    })
}

const updateReader = (req, res) => {
  const { id } = req.params;
  const newDetails = req.body;

  Reader
    .update(newDetails, { where: { id } })
    .then(([recordsUpdated]) => {
      if (!recordsUpdated) {
        res.status(404).json({ error: 'The reader could not be found.' });
      } else {
        Reader.findByPk(id).then((updatedReader) => {
          res
            .status(200)
            .json(updatedReader);
        }
        )
      }
    });
}

const getReaderById = (req, res) => {
  const { id } = req.params;

  Reader.findByPk(id).then(reader => {
    if (!reader) {
      res
        .status(404)
        .json({ error: 'The reader could not be found.' });
    } else {
      res
        .status(200)
        .json(reader);
    }
  });
}

const deleteReader = (req, res) => {
  const { id } = req.params;

  Reader
    .findByPk(id)
    .then(foundReader => {
      if (!foundReader) {
        res.status(404).json({ error: 'The reader could not be found.' });
      } else {
        Reader
          .destroy({ where: { id } })
          .then(() => {
            res.status(204).send();
          });
      }
    });
}

module.exports = {
  getReaders,
  getReaderById,
  createReader,
  updateReader,
  deleteReader
}