class ProgramService {
    constructor(programRepository, logRepository) {
        this.programRepository = programRepository;
        this.logRepository = logRepository;
    }

    async createProgram(programData, userData) {
        if (!programData.name || !programData.code || !programData.facultyId) {
            throw new Error('Required fields missing');
        }

        const t = await this.programRepository.sequelize.transaction();
        try {
            const program = await this.programRepository.create(programData, { transaction: t });

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'CREATE',
                table_name: 'program',
                record_id: program.id,
                old_values: '',
                new_values: JSON.stringify(programData),
            }, { transaction: t });

            await t.commit();
            return program;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to create program: ${error.message}`);
        }
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

    async updateProgram(id, programData, userData) {
        const t = await this.programRepository.sequelize.transaction();
        try {
            const oldProgram = await this.programRepository.findById(id);
            if (!oldProgram) {
                throw new Error('Program not found');
            }

            const updatedProgram = await this.programRepository.update(id, programData, { transaction: t });

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'UPDATE',
                table_name: 'program',
                record_id: id,
                old_values: JSON.stringify(oldProgram),
                new_values: JSON.stringify(programData),
            }, { transaction: t });

            await t.commit();
            return updatedProgram;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to update program: ${error.message}`);
        }
    }

    async deleteProgram(id, userData) {
        const t = await this.programRepository.sequelize.transaction();
        try {
            const program = await this.programRepository.findById(id);
            if (!program) {
                throw new Error('Program not found');
            }

            await this.programRepository.delete(id, { transaction: t });

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'DELETE',
                table_name: 'program',
                record_id: id,
                old_values: JSON.stringify(program),
                new_values: '',
            }, { transaction: t });

            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to delete program: ${error.message}`);
        }
    }
}

module.exports = ProgramService;