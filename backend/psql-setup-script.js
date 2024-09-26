const { sequelize } = require('./db/models');

sequelize.showAllSchemas({ logging: true }).then(async (data) => {
  if (!data.includes(process.env.SCHEMA)) {
    await sequelize.q(process.env.SCHEMA);
  }
});