const { Sequelize, DataTypes } = require("sequelize")

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

async function testMysqlConnection() {
    try {
        await sequelize.authenticate()
        console.log("Connection has been established successfully.")
    } catch (error) {
        console.error("Unable to connect to the database:", error)
    }
}

testMysqlConnection().then()

module.exports = {
    sequelize,
    DataTypes
}
