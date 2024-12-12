class StudentController {
  constructor(studentService) {
    this.studentService = studentService;
  }
  async getAllStudents(req, res) {
    try {
      const result = await this.studentService.getAllStudents(req.query);
      res.json(result);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      res.status(500).json({
        error: 'Failed to fetch all students',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  async searchStudents(req, res) {
    try {
      const result = await this.studentService.searchStudents(req.query);
      res.json(result);
    } catch (error) {
      console.error('Failed to search students:', error);
      res.status(500).json({
        error: 'Failed to fetch students',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  async createStudent(req, res) {
    try {
      const faculty = await this.studentService.createStudent(req.body);
      res.status(201).json(faculty);
    } catch (error) {
      console.error('Failed to create student:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getStudentById(req, res) {
    try {
      const student = await this.studentService.getStudentById(req.params.id);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = StudentController;
