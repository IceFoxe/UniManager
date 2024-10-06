const Student = require('../models/Student');
const Account = require('../models/Account');

class StudentDAO {
  static async findAll() {
    return await Student.findAll({
      include: [{ model: Account, attributes: ['email'] }]
    });
  }

  static async findById(id) {
    return await Student.findByPk(id, {
      include: [{ model: Account, attributes: ['email'] }]
    });
  }

  static async findByStudentNumber(studentNumber) {
    return await Student.findOne({
      where: { studentNumber },
      include: [{ model: Account, attributes: ['email'] }]
    });
  }

  static async create(studentData) {
    return await Student.create(studentData);
  }

  static async update(id, studentData) {
    const student = await Student.findByPk(id);
    if (student) {
      return await student.update(studentData);
    }
    return null;
  }

  static async delete(id) {
    const student = await Student.findByPk(id);
    if (student) {
      await student.destroy();
      return true;
    }
    return false;
  }
}

module.exports = StudentDAO;