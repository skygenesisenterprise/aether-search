const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const CrawlerData = sequelize.define("CrawlerData", {
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  crawledAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = CrawlerData;