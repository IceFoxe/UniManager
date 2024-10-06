const Major = require('../models/Major');
const Faculty = require('../models/Faculty'); // Assuming you have a Faculty model

class MajorDAO {
  static async findAll() {
    return await Major.findAll({
      include: [{ model: Faculty, attributes: ['name'] }]
    });
  }

  static async findById(id) {
    return await Major.findByPk(id, {
      include: [{ model: Faculty, attributes: ['name'] }]
    });
  }

  static async create(majorData) {
    return await Major.create(majorData);
  }

  static async update(id, majorData) {
    const major = await Major.findByPk(id);
    if (major) {
      return await major.update(majorData);
    }
    return null;
  }

  static async delete(id) {
    const major = await Major.findByPk(id);
    if (major) {
      await major.destroy();
      return true;
    }
    return false;
  }
}

module.exports = MajorDAO;