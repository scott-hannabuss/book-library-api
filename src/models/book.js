module.exports = (sequelize, DataTypes) => {
    const schema = {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    return sequelize.define('Book', schema);
};