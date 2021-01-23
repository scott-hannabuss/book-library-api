const {
  getAllReaders,
  createItem,
  updateItem,
  getReaderById,
  deleteItem,
} = require('./helpers');

const getReaders = (_, res) => getAllReaders(res, 'reader');

const createReader = (req, res) => createItem(res, 'reader', req.body);

const updateReader = (req, res) => updateItem(res, 'reader', req.body, req.params.id);

const getReader = (req, res) => getReaderById(res, 'reader', req.params.id);

const deleteReader = (req, res) => deleteItem(res, 'reader', req.params.id);

module.exports = {
  getReaders,
  getReader,
  createReader,
  updateReader,
  deleteReader,
  getAllReaders,
};
