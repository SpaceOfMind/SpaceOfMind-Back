"use strict";

const Sequelize = require("sequelize");
const process = require("process");
const User = require("./user");
const Around = require("./around");
const Away = require("./away");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

// db 객체 생성
const db = {};

// sequelize와 db 연결
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

db.sequelize = sequelize;

// model이 작성된 파일을 찾아서 db 객체에 삽입
db.User = User;
db.Around = Around;
db.Away = Away;

User.init(sequelize);
Around.init(sequelize);
Away.init(sequelize);

// Model간 관계를 설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;

module.exports = db;
