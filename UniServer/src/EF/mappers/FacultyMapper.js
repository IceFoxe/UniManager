const FacultyDTO = require('../DTO/FacultyDTO');

class FacultyMapper {
  static toDTO(faculty) {
    return new FacultyDTO(faculty.id, faculty.name, faculty.code);
  }

  static toDTOs(faculties) {
    return faculties.map(faculty => this.toDTO(faculty));
  }

  static toModel(facultyDTO) {
    return {
      name: facultyDTO.name,
      code: facultyDTO.code,
    };
  }
}

module.exports = FacultyMapper;