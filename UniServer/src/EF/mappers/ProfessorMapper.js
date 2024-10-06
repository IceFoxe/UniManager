const ProfessorDTO = require('../dto/ProfessorDTO');

class ProfessorMapper {
  static toDTO(professor) {
    return new ProfessorDTO(
      professor.id,
      professor.firstName,
      professor.lastName,
      professor.faculty,
      professor.accountId
    );
  }

  static toModel(dto) {
    return {
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      faculty: dto.faculty,
      accountId: dto.accountId,
    };
  }
}

module.exports = ProfessorMapper;