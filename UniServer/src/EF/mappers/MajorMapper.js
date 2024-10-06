const MajorDTO = require('../dto/MajorDTO');

class MajorMapper {
  static toDTO(major) {
    return new MajorDTO(
      major.id,
      major.Name,
      major.facultyId
    );
  }

  static toModel(dto) {
    return {
      id: dto.id,
      Name: dto.Name,
      facultyId: dto.facultyId,
    };
  }
}

module.exports = MajorMapper;