'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class testfile2 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  testfile2.init({
    message: DataTypes.STRING(50)
  }, {
    sequelize,
    modelName: 'testfile2',
  });
  return testfile2;
};