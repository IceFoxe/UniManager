const bcrypt = require("bcrypt");

class EmployeeService {
    constructor(employeeRepository, logRepository, accountRepository) {
        this.employeeRepository = employeeRepository;
        this.logRepository = logRepository;
        this.accountRepository = accountRepository;
    }

    async getAllEmployees() {
        const result = await this.employeeRepository.getAllEmployees();

        return {
            data: result.data.map(employee => ({
                id: employee.id,
                first_name: employee.account.first_name,
                last_name: employee.account.last_name,
                position: employee.position,
                employmentDate: employee.employmentDate,
                isAdmin: employee.isAdministrator,
                isTeachingStaff: employee.isTeachingStaff,
                employmentDuration: employee.employmentDuration
            })),
            metadata: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            }
        };
    }

    async searchEmployees(queryParams) {
        const filters = {
            position: queryParams.position,
            name: queryParams.name,
            page: parseInt(queryParams.page) || 1,
            limit: parseInt(queryParams.limit) || 10
        };

        const result = await this.employeeRepository.searchEmployees(filters);

        return {
            data: result.data.map(employee => ({
                id: employee.id,
                position: employee.position,
                employmentDate: employee.employmentDate,
                isAdmin: employee.isAdministrator,
                isTeachingStaff: employee.isTeachingStaff,
                employmentDuration: employee.employmentDuration
            })),
            metadata: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            }
        };
    }

    async getEmployeeById(id) {
        const employee = await this.employeeRepository.findById(id);
        if (!employee) return null;

        return {
            id: employee.id,
            position: employee.position,
            employmentDate: employee.employmentDate,
            isAdmin: employee.isAdministrator,
            isTeachingStaff: employee.isTeachingStaff,
            employmentDuration: employee.employmentDuration
        };
    }

    async createEmployee(employeeData, userData) {
        const t = await this.employeeRepository.sequelize.transaction();
        try {
            const login = `${employeeData.first_name.toLowerCase()}.${employeeData.last_name.toLowerCase()}`;
            const acc = await this.accountRepository.create({
                login: login,
                email: `${login}@university.com`,
                password_hash: await bcrypt.hash(employeeData.password || 'defaultPassword123', 10),
                first_name: employeeData.first_name,
                last_name: employeeData.last_name,
                role: employeeData.position,
            }, {transaction: t});

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'CREATE',
                table_name: 'account',
                record_id: acc.id,
                old_values: '',
                new_values: JSON.stringify(employeeData),
            }, {transaction: t});

            const employee = await this.employeeRepository.create({
                account_id: acc.id,
                position: employeeData.position,
                employment_date: employeeData.employment_date
            }, {transaction: t});

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'CREATE',
                table_name: 'employee',
                record_id: employee.id,
                old_values: '',
                new_values: JSON.stringify(employeeData),
            }, {transaction: t});

            await t.commit();
            return {id: employee.id};
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to create employee: ${error.message}`);
        }
    }

    async deleteEmployeeById(id, userData) {
        const t = await this.employeeRepository.sequelize.transaction();
        try {
            const employee = await this.employeeRepository.findById(id, {transaction: t});
            if (!employee) {
                throw new Error('Employee not found');
            }

            const oldValues = JSON.stringify(employee);

            await this.employeeRepository.delete(id, {transaction: t});
            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'DELETE',
                table_name: 'employee',
                record_id: id,
                old_values: oldValues,
                new_values: '',
            }, {transaction: t});

            await this.accountRepository.delete(employee.account_id, {transaction: t});
            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'DELETE',
                table_name: 'account',
                record_id: employee.account_id,
                old_values: oldValues,
                new_values: '',
            }, {transaction: t});

            await t.commit();
            return {success: true};
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to delete employee: ${error.message}`);
        }
    }

    async updateEmployeeById(id, updateData, userData) {
        const t = await this.employeeRepository.sequelize.transaction();
        try {
            const employee = await this.employeeRepository.findById(id, {transaction: t});
            if (!employee) {
                throw new Error('Employee not found');
            }

            const oldValues = JSON.stringify(employee);
            const updatedEmployee = await this.employeeRepository.update(id, updateData, {transaction: t});

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'UPDATE',
                table_name: 'employee',
                record_id: id,
                old_values: oldValues,
                new_values: JSON.stringify(updateData),
            }, {transaction: t});

            await t.commit();
            return updatedEmployee;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to update employee: ${error.message}`);
        }
    }
}

module.exports = EmployeeService;