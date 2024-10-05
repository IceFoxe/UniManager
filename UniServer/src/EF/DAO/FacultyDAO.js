const Faculty = require('../models/Faculty');

class FacultyDAO {
  static async findAll() {
    return await Faculty.findAll();
  }

  static async create(facultyData) {
    return await Faculty.create(facultyData);
  }

  static async findById(id) {
    return await Faculty.findByPk(id);
  }

  static async update(id, facultyData) {
    const faculty = await Faculty.findByPk(id);
    if (faculty) {
      return await faculty.update(facultyData);
    }
    return null;
  }

  static async delete(id) {
    const faculty = await Faculty.findByPk(id);
    if (faculty) {
      await faculty.destroy();
      return true;
    }
    return false;
  }
}

module.exports = FacultyDAO;