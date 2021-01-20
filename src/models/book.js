module.exports = (sequelize, DataTypes) => {
    const schema = {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        genre: DataTypes.STRING,
        ISBN: DataTypes.STRING,
    };

    return sequelize.define('Book', schema);
};