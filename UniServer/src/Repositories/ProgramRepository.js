const Program = require('../DomainModels/Program');
const Faculty = require('../DomainModels/Faculty');

class ProgramRepository {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.Program = sequelize.models.Program;
        this.Faculty = sequelize.models.Faculty;
    }

    toDomainModel(dbModel) {
        const plainData = dbModel.get({ plain: true });
        const program = new Program(plainData);

        if (plainData.Faculty) {
            program.faculty = new Faculty(plainData.Faculty);
        }

        return program;
    }

    async create(programData, options = {}) {
        try {
            const program = await this.Program.create({
                name: programData.name,
                code: programData.code,
                facultyId: programData.facultyId,
                description: programData.description,
                degreeLevel: programData.degreeLevel,
                duration: programData.duration,
                isActive: programData.isActive || true,
                createdAt: new Date(),
                transaction: options.transaction
            });

            return this.toDomainModel(program);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error(`Program with code ${programData.code} already exists`);
            }
            throw new Error(`Failed to create program: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const program = await this.Program.findOne({
                where: { id },
                include: [{
                    model: this.Faculty,
                    required: true
                }]
            });

            if (!program) {
                throw new Error(`Program with ID ${id} not found`);
            }

            return this.toDomainModel(program);
        } catch (error) {
            throw new Error(`Failed to fetch program: ${error.message}`);
        }
    }

    async getAll() {
        try {
            const { rows, count } = await this.Program.findAndCountAll({
                include: [{
                    model: this.Faculty,
                    required: true
                }],
                limit: 10,
                offset: 0
            });

            return {
                data: rows.map(program => this.toDomainModel(program)),
                total: count,
                page: 1,
                limit: 10
            };
        } catch (error) {
            throw new Error(`Failed to fetch all programs: ${error.message}`);
        }
    }

    async findByFaculty(facultyId) {
        try {
            const { rows, count } = await this.Program.findAndCountAll({
                where: { facultyId },
                include: [{
                    model: this.Faculty,
                    required: true
                }],
                limit: 10,
                offset: 0
            });

            return {
                data: rows.map(program => this.toDomainModel(program)),
                total: count,
                page: 1,
                limit: 10
            };
        } catch (error) {
            throw new Error(`Failed to fetch programs by faculty: ${error.message}`);
        }
    }

    async update(id, programData, options = {}) {
        try {
            const program = await this.Program.findByPk(id);
            if (!program) {
                throw new Error(`Program with ID ${id} not found`);
            }

            await program.update(programData,{transaction: options.transaction});
            return this.toDomainModel(program);
        } catch (error) {
            throw new Error(`Failed to update program: ${error.message}`);
        }
    }

    async delete(id, options = {}) {
        try {
            const program = await this.Program.findByPk(id);
            if (!program) {
                throw new Error(`Program with ID ${id} not found`);
            }

            await program.destroy({transaction: options.transaction});
            return true;
        } catch (error) {
            throw new Error(`Failed to delete program: ${error.message}`);
        }
    }
}

module.exports = ProgramRepository;