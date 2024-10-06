const ProfessorService = require('../services/ProfessorService');
const ProfessorDTO = require('../dto/ProfessorDTO');

class ProfessorController {
  static async getAllProfessors(req, res) {
    try {
      const professors = await ProfessorService.getAllProfessors();
      res.json(professors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProfessorById(req, res) {
    try {
      const professor = await ProfessorService.getProfessorById(req.params.id);
      if (professor) {
        res.json(professor);
      } else {
        res.status(404).json({ message: 'Professor not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createProfessor(req, res) {
    try {
        const accountId = req.body.accountId || req.user.id;
        const professorDTO = new ProfessorDTO(
            null,
            req.body.firstName,
            req.body.lastName,
            req.body.faculty,
        );
        const createdProfessor = await ProfessorService.createProfessor(professorDTO, accountId);
        res.status(201).json(createdProfessor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateProfessor(req, res) {
    try {
      const professorDTO = new ProfessorDTO(
        req.params.id,
        req.body.firstName,
        req.body.lastName,
        req.body.department,
        req.body.accountId
      );
      const updatedProfessor = await ProfessorService.updateProfessor(req.params.id, professorDTO);
      if (updatedProfessor) {
        res.json(updatedProfessor);
      } else {
        res.status(404).json({ message: 'Professor not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteProfessor(req, res) {
    try {
      const result = await ProfessorService.deleteProfessor(req.params.id);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Professor not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProfessorController;