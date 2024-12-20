class ProgramController {
    constructor(programService) {
        this.programService = programService;
    }

    async createProgram(req, res) {
        try {
            const program = await this.programService.createProgram(req.body, req.user);
            res.status(201).json(program);
        } catch (error) {
            console.error('Failed to create program:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async getProgramById(req, res) {
        try {
            const program = await this.programService.getProgramById(req.params.id);
            if (!program) {
                return res.status(404).json({ error: 'Program not found' });
            }
            res.json(program);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllPrograms(req, res) {
        try {
            const result = await this.programService.getAllPrograms();
            res.json(result);
        } catch (error) {
            console.error('Failed to fetch programs:', error);
            res.status(500).json({
                error: 'Failed to fetch all programs',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async getProgramsByFaculty(req, res) {
        try {
            const result = await this.programService.getProgramsByFaculty(req.params.facultyId);
            res.json(result);
        } catch (error) {
            console.error('Failed to fetch faculty programs:', error);
            res.status(500).json({
                error: 'Failed to fetch faculty programs',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async updateProgram(req, res) {
        try {
            const program = await this.programService.updateProgram(req.params.id, req.body);
            res.json(program);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProgram(req, res) {
        try {
            await this.programService.deleteProgram(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ProgramController;