class ProgramService {
    constructor(programRepository) {
        this.programRepository = programRepository;
    }

    async createProgram(programData) {
        if (!programData.name || !programData.code || !programData.facultyId) {
            throw new Error('Required fields missing');
        }

        return await this.programRepository.create(programData);
    }

    async getProgramById(id) {
        const program = await this.programRepository.findById(id);
        if (!program) return null;

        return {
            id: program.id,
            name: program.name,
            code: program.code,
            description: program.description,
            degreeLevel: program.degreeLevel,
            duration: program.duration,
            facultyName: program.faculty?.name,
            isActive: program.isActive
        };
    }

    async getAllPrograms() {
        const result = await this.programRepository.getAll();

        return {
            data: result.data.map(program => ({
                id: program.id,
                name: program.name,
                code: program.code,
                degreeLevel: program.degreeLevel,
                facultyName: program.faculty?.name,
                isActive: program.isActive
            })),
            metadata: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            }
        };
    }

    async getProgramsByFaculty(facultyId) {
        const result = await this.programRepository.findByFaculty(facultyId);

        return {
            data: result.data.map(program => ({
                id: program.id,
                name: program.name,
                code: program.code,
                degreeLevel: program.degreeLevel,
                facultyName: program.faculty?.name,
                isActive: program.isActive
            })),
            metadata: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            }
        };
    }

    async updateProgram(id, programData) {
        return await this.programRepository.update(id, programData);
    }

    async deleteProgram(id) {
        return await this.programRepository.delete(id);
    }
}

module.exports = ProgramService;