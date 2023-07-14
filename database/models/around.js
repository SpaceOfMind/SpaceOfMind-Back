const Sequelize = require("sequelize");

class Around extends Sequelize.Model {
  // static method
  // table에 대한 설정

  static init(sequelize) {
    return super.init(
      {
        // 첫번째 parameter: table field에 대한 설정
        aroundId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        aroundCode: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        orbitId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(500),
          allowNull: true,
        },
      },
      {
        // 두번째 parameter: table 자체에 대한 설정
        sequelize /* static init 메서드의 매개변수와 연결되는 옵션으로, db.sequelize 객체를 넣어야 한다. */,
        timestamps: true /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */,
        underscored: false /* 카멜 표기법을 스네이크 표기법으로 바꾸는 옵션 */,
        modelName: "Around" /* 모델 이름을 설정. */,
        tableName: "arounds" /* 데이터베이스의 테이블 이름. */,
        paranoid: false /* true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록된다. */,
        charset: "utf8" /* 인코딩 */,
        collate: "utf8_general_ci",
      }
    );
  }

  // 다른 모델과의 관계
  static associate(db) {
    db.Around.belongsTo(db.User, { foreignKey: "userId", targetKey: "userId" });
  }
}

module.exports = Around;
