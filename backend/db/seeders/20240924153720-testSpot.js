'use strict';
const bcrypt = require("bcryptjs");
const {spots} = requirerequire('../models');

module.exports = {
  async up (queryInterface, Sequelize) {
    module.exports = {
      async up (queryInterface, Sequelize) {
        await spots.bulkCreate([
          {
            address: "123",
            city: "test",
            state: "test",
            country: "test",
            lat: "123",
            lng: "123",
            name: "test",
            description: "test",
            price: "123"

          }
        ])
      }
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
