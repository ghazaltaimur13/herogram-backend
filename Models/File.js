// models/File.js
const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Connection');

const File = sequelize.define('File', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filepath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

// Define associations if necessary
// For example, if a file belongs to a user:
// File.belongsTo(User);

module.exports = File;
