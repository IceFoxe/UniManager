const Professor = require('../DomainModels/Professor');

class ProfessorRepository {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.Professor = sequelize.models.Professor;
    }

    toDomainModel(dbModel) {
        if (!dbModel) return null;
        const plainData = dbModel.get({ plain: true });
        return new Professor(plainData);
    }

    async findAll(params) {
        const { rows: data, count: total } = await this.Professor.findAndCountAll({
            where: params.filters,
            order: [['professor_id', 'ASC']],
            limit: params.limit,
            offset: (params.page - 1) * params.limit,
            include: ['faculty']
        });

        return {
            data: data.map(p => this.toDomainModel(p)),
            total,
            page: params.page,
            limit: params.limit
        };
    }

    async findById(id) {
        const professor = await this.Professor.findByPk(id, {
            include: ['faculty']
        });
        return this.toDomainModel(professor);
    }

    async findByEmployeeId(employeeId) {
        const professor = await this.Professor.findOne({
            where: { employee_id: employeeId },
            include: ['faculty']
        });
        return this.toDomainModel(professor);
    }

    async create(data, options = {}) {
        try {
            const professor = await this.Professor.create({
                employee_id: data.employee_id,
                faculty_id: data.faculty_id,
                degree: data.degree,
                specialization: data.specialization,
                created_at: new Date()
            }, { transaction: options.transaction });
            return this.toDomainModel(professor);
        } catch (error) {
            throw error;
        }
    }

    async update(id, data, options = {}) {
        try {
            await this.Professor.update(data, {
                where: { professor_id: id },
                transaction: options.transaction
            });

            const updated = await this.findById(id);
            return this.toDomainModel(updated);
        } catch (error) {
            throw error;
        }
    }

    async delete(id, options = {}) {
        try {
            const result = await this.Professor.destroy({
                where: { professor_id: id },
                transaction: options.transaction
            });
            return result === 1;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProfessorRepository;