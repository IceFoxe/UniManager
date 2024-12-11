class FacultyController {
  constructor(facultyService) {
    this.facultyService = facultyService;
  }
  async getFacultyPrograms(req, res){
    try {
      const result = await this.facultyService.getFacultyPrograms(req.params.id);
      res.json(result);
    } catch (error) {
      console.error('Failed to fetch faculties:', error);
      res.status(500).json({
        error: 'Failed to fetch faculties',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  async getFaculties(req, res) {
    try {
      const result = await this.facultyService.getFaculties(req.query);
      res.json(result);
    } catch (error) {
      console.error('Failed to fetch faculties:', error);
      res.status(500).json({
        error: 'Failed to fetch faculties',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getFacultyById(req, res) {
    try {
      const faculty = await this.facultyService.getFacultyById(req.params.id);
      if (!faculty) {
        return res.status(404).json({ error: 'Faculty not found' });
      }
      res.json(faculty);
    } catch (error) {
      console.error('Failed to fetch faculty:', error);
      res.status(500).json({ error: 'Failed to fetch faculty' });
    }
  }

  async createFaculty(req, res) {
    try {
      const faculty = await this.facultyService.createFaculty(req.body);
      res.status(201).json(faculty);
    } catch (error) {
      console.error('Failed to create faculty:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async updateFaculty(req, res) {
    try {
      const faculty = await this.facultyService.updateFaculty(req.params.id, req.body);
      if (!faculty) {
        return res.status(404).json({ error: 'Faculty not found' });
      }
      res.json(faculty);
    } catch (error) {
      console.error('Failed to update faculty:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async deleteFaculty(req, res) {
    try {
      const result = await this.facultyService.deleteFaculty(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Faculty not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Failed to delete faculty:', error);
      res.status(500).json({ error: 'Failed to delete faculty' });
    }
  }
}

module.exports = FacultyController;