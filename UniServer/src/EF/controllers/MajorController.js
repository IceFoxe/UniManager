const MajorService = require('../services/MajorService');
const MajorDTO = require('../dto/MajorDTO');

class MajorController {
  static async getAllMajors(req, res) {
    try {
      const majors = await MajorService.getAllMajors();
      res.json(majors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMajorById(req, res) {
    try {
      const major = await MajorService.getMajorById(req.params.id);
      if (major) {
        res.json(major);
      } else {
        res.status(404).json({ message: 'Major not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createMajor(req, res) {
    try {
      const majorDTO = new MajorDTO(
        null,
        req.body.Name,
        req.body.facultyId
      );
      const createdMajor = await MajorService.createMajor(majorDTO);
      res.status(201).json(createdMajor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateMajor(req, res) {
    try {
      const majorDTO = new MajorDTO(
        req.params.id,
        req.body.Name,
        req.body.facultyId
      );
      const updatedMajor = await MajorService.updateMajor(req.params.id, majorDTO);
      if (updatedMajor) {
        res.json(updatedMajor);
      } else {
        res.status(404).json({ message: 'Major not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteMajor(req, res) {
    try {
      const result = await MajorService.deleteMajor(req.params.id);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Major not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MajorController;