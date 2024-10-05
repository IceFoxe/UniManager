const FacultyDAO = require('../DAO/FacultyDAO');
const FacultyMapper = require('../mappers/FacultyMapper');

class FacultyService {
  static async getAllFaculties() {
    const faculties = await FacultyDAO.findAll();
    return FacultyMapper.toDTOs(faculties);
  }

  static async createFaculty(facultyDTO) {
    const facultyModel = FacultyMapper.toModel(facultyDTO);
    const createdFaculty = await FacultyDAO.create(facultyModel);
    return FacultyMapper.toDTO(createdFaculty);
  }

  static async getFacultyById(id) {
    const faculty = await FacultyDAO.findById(id);
    return faculty ? FacultyMapper.toDTO(faculty) : null;
  }

  static async updateFaculty(id, facultyDTO) {
    const facultyModel = FacultyMapper.toModel(facultyDTO);
    const updatedFaculty = await FacultyDAO.update(id, facultyModel);
    return updatedFaculty ? FacultyMapper.toDTO(updatedFaculty) : null;
  }

  static async deleteFaculty(id) {
    return await FacultyDAO.delete(id);
  }
}

module.exports = FacultyService;