class ProfessorController {
    constructor(professorService) {
        this.professorService = professorService;
    }

    async getProfessors(req, res) {
        try {
            const result = await this.professorService.getProfessors(req.query);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProfessorById(req, res) {
        try {
            const professor = await this.professorService.getProfessorById(req.params.id);
            if (!professor) {
                return res.status(404).json({ error: 'Professor not found' });
            }
            res.json(professor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createProfessor(req, res) {
        try {
            const professor = await this.professorService.createProfessor(req.body);
            res.status(201).json(professor);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateProfessor(req, res) {
        try {
            const professor = await this.professorService.updateProfessor(req.params.id, req.body);
            if (!professor) {
                return res.status(404).json({ error: 'Professor not found' });
            }
            res.json(professor);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteProfessor(req, res) {
        try {
            const result = await this.professorService.deleteProfessor(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Professor not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ProfessorController;