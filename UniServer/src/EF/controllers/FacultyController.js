const FacultyService = require('../services/FacultyService');
const FacultyDTO = require('../DTO/FacultyDTO');

class FacultyController {
  static async getAllFaculties(req, res) {
    try {
      const Faculty = await FacultyService.getAllFaculties();
      res.json(Faculty);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createFaculty(req, res) {
    try {
      const FacultyDTO = new FacultyDTO(null, req.body.nazwa, req.body.skrot);
      const createdFaculty = await FacultyService.createFaculty(FacultyDTO);
      res.status(201).json(createdFaculty);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getFacultyById(req, res) {
    try {
      const Faculty = await FacultyService.getFacultyById(req.params.id);
      if (Faculty) {
        res.json(Faculty);
      } else {
        res.status(404).json({ message: 'Wydział not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateFaculty(req, res) {
    try {
      const FacultyDTO = new FacultyDTO(req.params.id, req.body.nazwa, req.body.skrot);
      const updatedFaculty = await FacultyService.updateFaculty(req.params.id, FacultyDTO);
      if (updatedFaculty) {
        res.json(updatedFaculty);
      } else {
        res.status(404).json({ message: 'Wydział not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteFaculty(req, res) {
    try {
      const result = await FacultyService.deleteFaculty(req.params.id);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Wydział not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = FacultyController;