const { Book, Reader, Author, Genre } = require('../models');

const get404Error = (model) => ({ error: `The ${model} could not be found.` });

const getModel = (model) => {
    const models = {
        book: Book,
        reader: Reader,
        author: Author,
        genre: Genre,
    };

    return models[model];
};

const removePassword = (obj) => {
    if (obj.hasOwnProperty('password')) {
        delete obj.password;
    }

    return obj;
};


const getAllGenresorAuthors = (res, model) => {
    const Model = getModel(model);

    return Model.findAll({ include: Book }).then((items) => {
        const itemsWithoutPassword = items.map((item) =>
            removePassword(item.dataValues)
        );
        res.status(200).json(itemsWithoutPassword);
    });
};

const getAllBooks = (res, model) => {

    const Model = getModel(model);

    return Model.findAll({ include: [Reader, Genre, Author] }).then((items) => {
        res.status(200).json(items);
    })
        .catch(error => { console.log(error) })
};

const getAllReaders = (res, model) => {

    const Model = getModel(model);

    return Model.findAll({ include: Book }).then((items) => {
        const itemsWithoutPassword = items.map((item) =>
            removePassword(item.dataValues)
        );
        res.status(200).json(itemsWithoutPassword);
    })
        .catch(error => { console.log(error) })
};

const getGenreorAuthorById = (res, model, id) => {
    const Model = getModel(model);
    return Model.findByPk(id, { include: Book }).then((item) => {
        if (!item) {
            res.status(404).json(get404Error(model));
        } else {
            const itemWithoutPassword = removePassword(item.dataValues);

            res.status(200).json(itemWithoutPassword)
        }
    });
};

const getBookById = (res, model, id) => {
    const Model = getModel(model);
    return Model.findByPk(id, { include: [Reader, Genre, Author] }).then((item) => {
        if (!item) {
            res.status(404).json(get404Error(model));
        } else {
            const itemWithoutPassword = removePassword(item.dataValues);

            res.status(200).json(itemWithoutPassword)
        }
    });
};

const getReaderById = (res, model, id) => {
    const Model = getModel(model);
    return Model.findByPk(id, { include: Book }).then((item) => {
        if (!item) {
            res.status(404).json(get404Error(model));
        } else {
            const itemWithoutPassword = removePassword(item.dataValues);

            res.status(200).json(itemWithoutPassword)
        }
    });
};

const createItem = (res, model, item) => {
    const Model = getModel(model);

    return Model.create(item)
        .then(newItemCreated => {
            const itemWithoutPassword = removePassword(newItemCreated.dataValues);
            res.status(201).json(itemWithoutPassword)
        })

        .catch((Error) => {
            const Errors = Error.errors.map((thisError) => thisError.message);
            res.status(422).json(Errors);
        })
}




const updateItem = (res, model, item, id) => {
    const Model = getModel(model);
    return Model.update(item, { where: { id } }).then(([recordsUpdated]) => {
        if (!recordsUpdated) {
            res.status(404).json(get404Error(model));
        } else {
            getModel(model)
                .findByPk(id)
                .then((updatedItem) => {
                    const itemWithoutPassword = removePassword(updatedItem.dataValues);
                    res.status(200).json(itemWithoutPassword);
                });
        }
    });
};



const deleteItem = (res, model, id) => {
    const Model = getModel(model);

    return Model.findByPk(id).then((foundItem) => {
        if (!foundItem) {
            res.status(404).json(get404Error(model));
        } else {
            Model.destroy({ where: { id } }).then(() => {
                res.status(204).send();
            });
        }
    });
};

module.exports = {
    getAllGenresorAuthors,
    createItem,
    updateItem,
    getReaderById,
    getBookById,
    getGenreorAuthorById,
    deleteItem,
    getAllBooks,
    getAllReaders,
};