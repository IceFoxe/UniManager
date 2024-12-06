class StudentController {
  constructor(studentService) {
    this.studentService = studentService;
  }

  async getStudents(req, res) {
    try {
      const result = await this.studentService.searchStudents(req.query);
      res.json(result);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      res.status(500).json({
        error: 'Failed to fetch students',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
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
