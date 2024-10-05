const GradeDAO = require('../dao/GradeDAO');
const GradeMapper = require('../mappers/GradeMapper');

class GradeService {
    static async getAllGrades() {
        const grades = await GradeDAO.findAll();
        return grades.map(GradeMapper.toDTO);
    }

    static async getGradeById(id) {
        const grade = await GradeDAO.findById(id);
        return grade ? GradeMapper.toDTO(grade) : null;
    }

    static async createGrade(gradeDTO) {
        const gradeData = GradeMapper.toModel(gradeDTO);
        const createdGrade = await GradeDAO.create(gradeData);
        return GradeMapper.toDTO(createdGrade);
    }

    static async updateGrade(id, gradeDTO) {
        const gradeData = GradeMapper.toModel(gradeDTO);
        const updatedGrade = await GradeDAO.update(id, gradeData);
        return updatedGrade ? GradeMapper.toDTO(updatedGrade) : null;
    }

    static async deleteGrade(id) {
        return await GradeDAO.delete(id);
    }
}

module.exports = GradeService;