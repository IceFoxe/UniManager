const Faculty = require('../DomainModels/Faculty')
const Program = require('../DomainModels/Program')
class FacultyRepository {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.Faculty = sequelize.models.Faculty;
        this.Program = sequelize.models.Program;
    }

    toDomainModel(dbModel) {
        const plainData = dbModel.get({ plain: true });
        const faculty = new Faculty(plainData);

        if (plainData.Programs) {
            faculty.programs = plainData.Programs.map(program => new Program(program));
        }

        return faculty;
    }

    async create(facultyData) {
        const t = await this.sequelize.transaction();
        try {
            const faculty = await this.Faculty.create({
                name: facultyData.name,
                code: facultyData.code,
                created_at: new Date()
            }, { transaction: t });

            await t.commit();
            return this.toDomainModel(faculty);
        } catch (error) {
            await t.rollback();
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error(`Faculty with code ${facultyData.code} already exists`);
            }
            throw new Error(`Failed to create faculty: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const faculty = await this.Faculty.findOne({
                where: { id },
                include: [{
                    model: this.Program,
                    required: false
                }]
            });

            if (!faculty) {
                throw new Error(`Faculty with ID ${id} not found`);
            }

            return this.toDomainModel(faculty);
        } catch (error) {
            throw new Error(`Failed to fetch faculty: ${error.message}`);
        }
    }

    async findAll(options = {}) {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'createdAt',
            sortDir = 'DESC'
        } = options;

        try {
            const queryOptions = {
                include: [{
                    model: this.Program,
                    required: false
                }],
                where: {},
                order: [[sortBy, sortDir]],
                limit,
                offset: (page - 1) * limit
            };

            if (search) {
                queryOptions.where = {
                    [this.sequelize.Op.or]: [
                        {
                            name: {
                                [this.sequelize.Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            code: {
                                [this.sequelize.Op.iLike]: `%${search}%`
                            }
                        }
                    ]
                };
            }

            const { rows, count } = await this.Faculty.findAndCountAll(queryOptions);

            return {
                data: rows.map(faculty => this.toDomainModel(faculty)),
                total: count,
                page,
                limit
            };
        } catch (error) {
            throw new Error(`Failed to fetch faculties: ${error.message}`);
        }
    }

    async update(id, facultyData) {
        const t = await this.sequelize.transaction();
        try {
            const faculty = await this.Faculty.findByPk(id, { transaction: t });
            if (!faculty) {
                await t.rollback();
                throw new Error(`Faculty with ID ${id} not found`);
            }

            await faculty.update(facultyData, { transaction: t });
            await t.commit();

            return this.toDomainModel(faculty);
        } catch (error) {
            await t.rollback();
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error(`Faculty with code ${facultyData.code} already exists`);
            }
            throw new Error(`Failed to update faculty: ${error.message}`);
        }
    }

    async delete(id) {
        const t = await this.sequelize.transaction();
        try {
            const faculty = await this.Faculty.findByPk(id, { transaction: t });
            if (!faculty) {
                await t.rollback();
                throw new Error(`Faculty with ID ${id} not found`);
            }

            const programCount = await this.Program.count({
                where: { faculty_id: id },
                transaction: t
            });

            if (programCount > 0) {
                await t.rollback();
                throw new Error('Cannot delete faculty with associated programs');
            }

            await faculty.destroy({ transaction: t });
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to delete faculty: ${error.message}`);
        }
    }
}

module.exports = FacultyRepository;