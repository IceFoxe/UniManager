const Grade = require('../models/Grade');

class GradeDAO {
    static async findAll() {
        return await Grade.findAll();
    }

    static async findById(id) {
        return await Grade.findByPk(id);
    }

    static async create(gradeData) {
        return await Grade.create(gradeData);
    }

    static async update(id, gradeData) {
        const grade = await Grade.findByPk(id);
        if (grade) {
            return await grade.update(gradeData);
        }
        return null;
    }

    static async delete(id) {
        const grade = await Grade.findByPk(id);
        if (grade) {
            await grade.destroy();
            return true;
        }
        return false;
    }
}

module.exports = GradeDAO;