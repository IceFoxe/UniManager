module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    studentNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    majorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Majors',  // This should match the table name of your Major model
        key: 'id',
      },
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Accounts',  // This should match the table name of your Account model
        key: 'id',
      },
    },
  }, {
    tableName: 'Students',
    timestamps: true,  // This will add createdAt and updatedAt fields
  });

  Student.associate = (models) => {
    // Define associations here
    Student.belongsTo(models.Major, { foreignKey: 'majorId' });
    Student.belongsTo(models.Account, { foreignKey: 'accountId' });
    Student.hasMany(models.Grade, { foreignKey: 'student_id' });
    // Add any other associations as needed
  };

  return Student;
};