const Professor = require('../DomainModels/Professor');

class ProfessorService {
    constructor(professorRepository) {
        this.professorRepository = professorRepository;
    }

    async getProfessors(queryParams) {
        const filters = {};
        if (queryParams.facultyId) filters.facultyId = queryParams.facultyId;
        if (queryParams.academicTitle) filters.academicTitle = queryParams.academicTitle;

        const result = await this.professorRepository.findAll({
            filters,
            page: parseInt(queryParams.page) || 1,
            limit: parseInt(queryParams.limit) || 10
        });

        return {
            data: result.data.map(prof => new Professor(prof).toJSON()),
            metadata: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            }
        };
    }

    async getProfessorById(id) {
        const professor = await this.professorRepository.findById(id);
        return professor ? new Professor(professor).toJSON() : null;
    }

    async createProfessor(data) {
        const professor = new Professor(data);
        professor.validate();
        return this.professorRepository.create(data);
    }

    async updateProfessor(id, data) {
        const professor = new Professor({ id, ...data });
        professor.validate();
        return this.professorRepository.update(id, data);
    }

    async deleteProfessor(id) {
        return this.professorRepository.delete(id);
    }
}

module.exports = ProfessorService;