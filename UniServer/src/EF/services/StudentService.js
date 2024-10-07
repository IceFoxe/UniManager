const StudentDAO = require('../dao/StudentDAO');
const StudentMapper = require('../mappers/StudentMapper');

class StudentService {
  static async getAllStudents() {
    const students = await StudentDAO.findAll();
    console.log("no student");
    return students.map(StudentMapper.toDTO);
  }

  static async getStudentById(id) {
    const student = await StudentDAO.findById(id);
    return student ? StudentMapper.toDTO(student) : null;
  }

  static async getStudentByStudentNumber(studentNumber) {
    const student = await StudentDAO.findByStudentNumber(studentNumber);
    return student ? StudentMapper.toDTO(student) : null;
  }

  static async createStudent(studentDTO, accountId) {
    const studentData = StudentMapper.toModel(studentDTO);
    studentData.accountId = accountId;
    const createdStudent = await StudentDAO.create(studentData);
    return StudentMapper.toDTO(createdStudent);
  }

  static async updateStudent(id, studentDTO) {
    const studentData = StudentMapper.toModel(studentDTO);
    const updatedStudent = await StudentDAO.update(id, studentData);
    return updatedStudent ? StudentMapper.toDTO(updatedStudent) : null;
  }

  static async deleteStudent(id) {
    return await StudentDAO.delete(id);
  }
}

module.exports = StudentService;