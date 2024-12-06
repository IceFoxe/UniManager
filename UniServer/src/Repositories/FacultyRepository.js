const { Op } = require('sequelize');
const Faculty = require('../DomainModels/Faculty');
const Program = require('../DomainModels/Program');

class FacultyRepository {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.dialect = sequelize.getDialect();
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

    async findAll(filters) {
        const queryOptions = {
            include: [{
                model: this.Program,
                required: false,
                attributes: ['id', 'name', 'code']
            }],
            where: {},
            limit: filters.limit || 10,
            offset: ((filters.page || 1) - 1) * (filters.limit || 10),
            order: [[filters.sortBy || 'name', filters.sortDir || 'ASC']]
        };

        if (filters.search) {
            queryOptions.where[Op.or] = [
                { name: { [Op.iLike]: `%${filters.search}%` }},
                { code: { [Op.iLike]: `%${filters.search}%` }}
            ];
        }

        try {
            const { rows, count } = await this.Faculty.findAndCountAll(queryOptions);

            return {
                data: rows.map(faculty => this.toDomainModel(faculty)),
                total: count,
                page: filters.page || 1,
                limit: filters.limit || 10
            };
        } catch (error) {
            console.error('Database query failed:', {
                error: error.message,
                sql: error.sql
            });
            throw new Error(`Failed to fetch faculties: ${error.message}`);
        }
    }

    async findById(id) {
        const faculty = await this.Faculty.findByPk(id, {
            include: [{
                model: this.Program,
                required: false,
                attributes: ['id', 'name', 'code']
            }]
        });

        return faculty ? this.toDomainModel(faculty) : null;
    }

    async findByCode(code) {
        const faculty = await this.Faculty.findOne({
            where: { code },
            include: [{
                model: this.Program,
                required: false,
                attributes: ['id', 'name', 'code']
            }]
        });

        return faculty ? this.toDomainModel(faculty) : null;
    }
}

module.exports = FacultyRepository;