const { Sequelize } = require("sequelize");
const config = require("./config");

async function connectToDB() {
  const sequelize = new Sequelize(config.development);

  try {
    await sequelize.authenticate();
    console.log(`Connection to DB successful`);
  } catch (error) {
    console.log(`Error connecting to DB`, error);
    throw error;
  }

  return sequelize;
}

// sequelize
//   .authenticate()
//   .then(() => console.log(`Connection to DB successful`))
//   .catch((err) => console.log(`An error occured: `, err));

module.exports = { connectToDB };
