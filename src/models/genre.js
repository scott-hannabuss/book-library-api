module.exports = (sequelize, DataTypes) => {
    const schema = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    return sequelize.define('Genre', schema);
};