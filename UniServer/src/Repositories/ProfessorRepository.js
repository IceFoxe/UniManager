class ProfessorRepository {
    constructor(sequelize) {
        this.Professor = sequelize.models.Professor;
    }

    async findAll(params) {
        const { rows: data, count: total } = await this.Professor.findAndCountAll({
            where: params.filters,
            order: [['id', 'ASC']],
            limit: params.limit,
            offset: (params.page - 1) * params.limit,
            include: ['faculty']
        });

        return { data, total, page: params.page, limit: params.limit };
    }

    async findById(id) {
        return this.Professor.findByPk(id, { include: ['faculty'] });
    }

    async findByEmployeeId(employeeId) {
        return this.Professor.findOne({
            where: { employee_Id: employeeId },
            include: ['faculty']
        });
    }

    async create(data) {
        return this.Professor.create(data);
    }

    async update(id, data) {
        const [updatedRows] = await this.Professor.update(data, {
            where: { id },
            returning: true
        });
        return updatedRows > 0 ? this.findById(id) : null;
    }

    async delete(id) {
        return this.Professor.destroy({ where: { id } });
    }
}

module.exports = ProfessorRepository;