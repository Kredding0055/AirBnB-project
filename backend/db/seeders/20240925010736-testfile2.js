'use strict';
const {testfile2}=require('../models');


module.exports = {
  async up (queryInterface, Sequelize) {
    await testfile2.create({
      message : "hello world"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('testfile2', null, {});
  }
};
