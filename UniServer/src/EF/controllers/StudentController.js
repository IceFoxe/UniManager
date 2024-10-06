const StudentService = require('../services/StudentService');
const StudentDTO = require('../dto/StudentDTO');

class StudentController {
  static async getAllStudents(req, res) {
    try {
      const students = await StudentService.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStudentById(req, res) {
    try {
      const student = await StudentService.getStudentById(req.params.id);
      if (student) {
        res.json(student);
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStudentByStudentNumber(req, res) {
    try {
      const student = await StudentService.getStudentByStudentNumber(req.params.studentNumber);
      if (student) {
        res.json(student);
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createStudent(req, res) {
    try {
    const accountId = req.body.accountId || req.user.id;
    const studentDTO = new StudentDTO(
      null,
      req.body.firstName,
      req.body.lastName,
      req.body.studentNumber,
      req.body.majorId
    );
    const createdStudent = await StudentService.createStudent(studentDTO, accountId);
    res.status(201).json(createdStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  }

  static async updateStudent(req, res) {
    try {
      const studentDTO = new StudentDTO(
        req.params.id,
        req.body.firstName,
        req.body.lastName,
        req.body.studentNumber,
        req.body.majorId,
        req.body.accountId
      );
      const updatedStudent = await StudentService.updateStudent(req.params.id, studentDTO);
      if (updatedStudent) {
        res.json(updatedStudent);
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteStudent(req, res) {
    try {
      const result = await StudentService.deleteStudent(req.params.id);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = StudentController;