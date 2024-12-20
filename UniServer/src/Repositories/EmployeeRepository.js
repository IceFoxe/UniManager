const {Op} = require('sequelize');
const Employee = require('../DomainModels/Employee');
const Account = require('../DomainModels/Account');

class EmployeeRepository {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.dialect = sequelize.getDialect();
        this.Employee = sequelize.models.Employee;
        this.Account = sequelize.models.Account;
    }

    toDomainModel(dbModel) {
        const plainData = dbModel.get({plain: true});
        const employee = new Employee(plainData);

        if (plainData.Account) {
            employee.account = new Account(plainData.Account);
        }

        return employee;
    }

    async getAllEmployees() {
        const queryOptions = {
            include: [
                {
                    model: this.Account,
                    required: true,
                    attributes: ['first_name', 'last_name', 'account_id']
                }
            ],
            attributes: ['employee_id', 'position', 'employment_date'],
            limit: 10,
            offset: 0
        };

        try {
            const {rows, count} = await this.Employee.findAndCountAll(queryOptions);

            return {
                data: rows.map(employee => this.toDomainModel(employee)),
                total: count,
                page: 1,
                limit: 10
            };
        } catch (error) {
            throw new Error(`Failed to find all employees: ${error.message}`);
        }
    }

    async searchEmployees(filters) {
        const queryOptions = {
            include: [
                {
                    model: this.Account,
                    required: true,
                    attributes: ['first_name', 'last_name', 'account_id']
                }
            ],
            where: {},
            limit: filters.limit || 10,
            offset: ((filters.page || 1) - 1) * (filters.limit || 10)
        };

        if (filters.position) {
            queryOptions.where.position = filters.position;
        }

        if (filters.name) {
            queryOptions.include[0].where = {
                [Op.or]: [
                    {first_name: {[Op.like]: `%${filters.name}%`}},
                    {last_name: {[Op.like]: `%${filters.name}%`}}
                ]
            };
        }

        try {
            const {rows, count} = await this.Employee.findAndCountAll(queryOptions);

            return {
                data: rows.map(employee => this.toDomainModel(employee)),
                total: count,
                page: filters.page || 1,
                limit: filters.limit || 10
            };
        } catch (error) {
            throw new Error(`Failed to search employees: ${error.message}`);
        }
    }

    async findById(employeeId) {
        try {
            const employee = await this.Employee.findOne({
                where: {employee_id: employeeId},
                include: [
                    {
                        model: this.Account,
                        required: true,
                        attributes: ['first_name', 'last_name', 'account_id']
                    }
                ]
            });

            if (!employee) {
                throw new Error(`Employee with ID ${employeeId} not found`);
            }

            return this.toDomainModel(employee);
        } catch (error) {
            throw new Error(`Failed to fetch employee: ${error.message}`);
        }
    }

    async create(employeeData, options = {}) {
        try {
            const employee = await this.Employee.create({
                account_id: employeeData.account_id,
                position: employeeData.position,
                employment_date: employeeData.employment_date || new Date(),
                created_at: new Date()
            }, {
                transaction: options.transaction
            });

            return this.toDomainModel(employee);
        } catch (error) {
            throw new Error(`Failed to create employee: ${error.message}`);
        }
    }

    async delete(employeeId, options = {}) {
        try {
            const result = await this.Employee.destroy({
                where: {employee_id: employeeId},
                transaction: options.transaction
            });

            if (result === 0) {
                throw new Error(`Employee with ID ${employeeId} not found`);
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to delete employee: ${error.message}`);
        }
    }

    async update(employeeId, updateData, options = {}) {
        try {
            const employee = await this.Employee.findOne({
                where: {employee_id: employeeId},
                transaction: options.transaction
            });

            if (!employee) {
                throw new Error(`Employee with ID ${employeeId} not found`);
            }

            await employee.update({
                position: updateData.position,
                employment_date: updateData.employment_date,
                updated_at: new Date()
            }, {
                transaction: options.transaction
            });

            const updatedEmployee = await this.findById(employeeId);
            return this.toDomainModel(updatedEmployee);
        } catch (error) {
            throw new Error(`Failed to update employee: ${error.message}`);
        }
    }
}

module.exports = EmployeeRepository;