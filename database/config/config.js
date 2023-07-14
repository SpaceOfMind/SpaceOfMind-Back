const dotenv = require('dotenv');
dotenv.config();

const development = {
  username: process.env.USERNAME,
  database: process.env.DB,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  dialect: "mysql",
}

module.exports = { development };
