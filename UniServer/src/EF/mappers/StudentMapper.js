const StudentDTO = require('../dto/StudentDTO');

class StudentMapper {
  static toDTO(student) {
    return new StudentDTO(
      student.id,
      student.firstName,
      student.lastName,
      student.studentNumber,
      student.majorId,
      student.accountId
    );
  }

  static toModel(dto) {
    return {
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      studentNumber: dto.studentNumber,
      majorId: dto.majorId,
      accountId: dto.accountId,
    };
  }
}

module.exports = StudentMapper;