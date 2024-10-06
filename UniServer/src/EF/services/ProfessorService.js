const ProfessorDAO = require('../dao/ProfessorDAO');
const ProfessorMapper = require('../mappers/ProfessorMapper');

class ProfessorService {
  static async getAllProfessors() {
    const professors = await ProfessorDAO.findAll();
    return professors.map(ProfessorMapper.toDTO);
  }

  static async getProfessorById(id) {
    const professor = await ProfessorDAO.findById(id);
    return professor ? ProfessorMapper.toDTO(professor) : null;
  }

  static async createProfessor(professorDTO, accountId) {
    const professorData = ProfessorMapper.toModel(professorDTO);
    professorData.accountId = accountId;
    const createdProfessor = await ProfessorDAO.create(professorData);
    return ProfessorMapper.toDTO(createdProfessor);
  }

  static async updateProfessor(id, professorDTO) {
    const professorData = ProfessorMapper.toModel(professorDTO);
    const updatedProfessor = await ProfessorDAO.update(id, professorData);
    return updatedProfessor ? ProfessorMapper.toDTO(updatedProfessor) : null;
  }

  static async deleteProfessor(id) {
    return await ProfessorDAO.delete(id);
  }
}

module.exports = ProfessorService;
