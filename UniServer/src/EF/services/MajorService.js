const MajorDAO = require('../dao/MajorDAO');
const MajorMapper = require('../mappers/MajorMapper');

class MajorService {
  static async getAllMajors() {
    const majors = await MajorDAO.findAll();
    return majors.map(MajorMapper.toDTO);
  }

  static async getMajorById(id) {
    const major = await MajorDAO.findById(id);
    return major ? MajorMapper.toDTO(major) : null;
  }

  static async createMajor(majorDTO) {
    const majorData = MajorMapper.toModel(majorDTO);
    const createdMajor = await MajorDAO.create(majorData);
    return MajorMapper.toDTO(createdMajor);
  }

  static async updateMajor(id, majorDTO) {
    const majorData = MajorMapper.toModel(majorDTO);
    const updatedMajor = await MajorDAO.update(id, majorData);
    return updatedMajor ? MajorMapper.toDTO(updatedMajor) : null;
  }

  static async deleteMajor(id) {
    return await MajorDAO.delete(id);
  }
}

module.exports = MajorService;