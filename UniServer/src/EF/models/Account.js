const bcrypt = require('bcrypt');

module.exports = (sequelize, ) => {
  const { DataTypes } = require('sequelize');
  const Account = sequelize.define('Account', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('student', 'professor', 'admin'),
      allowNull: false,
    },
  }, {
    tableName: 'Accounts',
    timestamps: true,
    hooks: {
      beforeCreate: async (account) => {
        const salt = await bcrypt.genSalt(10);
        account.password = await bcrypt.hash(account.password, salt);
      },
      beforeUpdate: async (account) => {
        if (account.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          account.password = await bcrypt.hash(account.password, salt);
        }
      },
    },
  });

  Account.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  Account.associate = (models) => {
    // Define associations here
    // For example:
    // Account.hasOne(models.Student);
    // Account.hasOne(models.Professor);
  };

  return Account;
};