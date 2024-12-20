class GradeController {
    constructor(gradeService) {
        this.gradeService = gradeService;
    }

    async createGrade(req, res) {
        try {
            const grade = await this.gradeService.createGrade(req.body, req.user);
            res.status(201).json(grade);
        } catch (error) {
            console.error('Failed to create grade:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async getStudentGrades(req, res) {
        try {
            const result = await this.gradeService.getStudentGrades(req.params.studentId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCourseGrades(req, res) {
        try {
            const result = await this.gradeService.getGroupGrades(req.params.courseId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateGrade(req, res) {
        try {
            const grade = await this.gradeService.updateGrade(req.params.id, req.body);
            res.json(grade);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteGrade(req, res) {
        try {
            await this.gradeService.deleteGrade(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = GradeController;