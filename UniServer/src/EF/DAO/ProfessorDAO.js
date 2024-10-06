const Professor = require('../models/Professor');
const Account = require('../models/Account');

class ProfessorDAO {
  static async findAll() {
    return await Professor.findAll({
      include: [{ model: Account, attributes: ['email'] }]
    });
  }

  static async findById(id) {
    return await Professor.findByPk(id, {
      include: [{ model: Account, attributes: ['email'] }]
    });
  }

  static async create(professorData) {
    return await Professor.create(professorData);
  }

  static async update(id, professorData) {
    const professor = await Professor.findByPk(id);
    if (professor) {
      return await professor.update(professorData);
    }
    return null;
  }

  static async delete(id) {
    const professor = await Professor.findByPk(id);
    if (professor) {
      await professor.destroy();
      return true;
    }
    return false;
  }
}

module.exports = ProfessorDAO;
