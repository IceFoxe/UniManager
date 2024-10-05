const GradeService = require('../services/GradeService');
const GradeDTO = require('../dto/GradeDTO');

class GradeController {
    static async getAllGrades(req, res) {
        try {
            const grades = await GradeService.getAllGrades();
            res.json(grades);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getGradeById(req, res) {
        try {
            const grade = await GradeService.getGradeById(req.params.id);
            if (grade) {
                res.json(grade);
            } else {
                res.status(404).json({ message: 'Grade not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createGrade(req, res) {
        try {
            const gradeDTO = new GradeDTO(
                null,
                req.body.student_id,
                req.body.group_id,
                req.body.value,
                req.body.date,
                req.user.id // Adding the user who created the grade
            );
            const createdGrade = await GradeService.createGrade(gradeDTO);
            res.status(201).json(createdGrade);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateGrade(req, res) {
        try {
            const gradeDTO = new GradeDTO(
                req.params.id,
                req.body.student_id,
                req.body.group_id,
                req.body.value,
                req.body.date
            );
            const updatedGrade = await GradeService.updateGrade(req.params.id, gradeDTO);
            if (updatedGrade) {
                res.json(updatedGrade);
            } else {
                res.status(404).json({ message: 'Grade not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteGrade(req, res) {
        try {
            const result = await GradeService.deleteGrade(req.params.id);
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Grade not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = GradeController;