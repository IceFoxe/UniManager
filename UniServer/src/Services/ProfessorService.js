class ProfessorService {
    constructor(professorRepository, logRepository, employeeRepository, accountRepository) {
        this.professorRepository = professorRepository;
        this.employeeRepository = employeeRepository;
        this.accountRepository = accountRepository;
        this.logRepository = logRepository;
    }

    async getProfessors(queryParams) {
        try {
            return await this.professorRepository.findAll({
                filters: {},
                page: parseInt(queryParams.page) || 1,
                limit: parseInt(queryParams.limit) || 10
            });
        } catch (error) {
            throw error;
        }
    }

    async getProfessorById(id) {
        try {
            const professor = await this.professorRepository.findById(id);
            if (!professor) {
                throw new Error('Professor not found');
            }
            return professor;
        } catch (error) {
            throw error;
        }
    }

     async createProfessor(data, user) {
        const transaction = await this.professorRepository.sequelize.transaction();
        try {
            const login = `${data.first_name.slice(0, 3).toLowerCase()}${data.last_name.slice(0, 3)}`;
            const accountData = {
                login: login,
                email: `${data.first_name}@gmail.com`,
                password_hash: data.password_hash,
                first_name: data.first_name,
                last_name: data.last_name,
                role: 'professor'
            };
            const account = await this.accountRepository.create(accountData, { transaction });


            const employeeData = {
                account_id: account.account_id,
                position: 'Professor',
            };
            const employee = await this.employeeRepository.create(employeeData, { transaction });


            const professorData = {
                employee_id: employee.employee_id,
                faculty_id: data.faculty_id,
                degree: data.degree,
                specialization: data.specialization
            };
            const professor = await this.professorRepository.create(professorData, { transaction });

            await this.logRepository.create({
                account_id: user.userId,
                timestamp: new Date(),
                action: 'CREATE_PROFESSOR',
                table_name: 'professors',
                record_id: professor.professor_id,
                old_values: null,
                new_values: JSON.stringify({
                    ...accountData,
                    ...employeeData,
                    ...professorData
                }),
                ip_address: user.ip,
                user_agent: user.userAgent,
                created_at: new Date()
            }, { transaction });

            await transaction.commit();
            return professor;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateProfessor(id, data, user) {
        const transaction = await this.professorRepository.sequelize.transaction();
        try {
            const oldProfessor = await this.professorRepository.findById(id);
            if (!oldProfessor) {
                throw new Error('Professor not found');
            }

            const professor = await this.professorRepository.update(id, {
                faculty_id: data.faculty_id,
                degree: data.degree,
                specialization: data.specialization
            }, { transaction });

            if (data.department || data.position || data.salary) {
                await this.employeeRepository.update(professor.employee_id, {
                    department: data.department,
                    position: data.position,
                    salary: data.salary
                }, { transaction });
            }

            await this.logRepository.create({
                account_id: user.userId,
                timestamp: new Date(),
                action: 'UPDATE_PROFESSOR',
                table_name: 'professors',
                record_id: id,
                old_values: JSON.stringify(oldProfessor),
                new_values: JSON.stringify(data),
                ip_address: user.ip,
                user_agent: user.userAgent,
                created_at: new Date()
            }, { transaction });

            await transaction.commit();
            return professor;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteProfessor(id, user) {
        const transaction = await this.professorRepository.sequelize.transaction();
        try {
            const professor = await this.professorRepository.findById(id);
            if (!professor) {
                throw new Error('Professor not found');
            }

            // Get employee info before deletion
            const employee = await this.employeeRepository.findById(professor.employee_id);

            // Delete in reverse order
            await this.professorRepository.delete(id, { transaction });
            await this.employeeRepository.delete(professor.employee_id, { transaction });
            await this.accountRepository.delete(employee.account_id, { transaction });

            await this.logRepository.create({
                account_id: user.userId,
                timestamp: new Date(),
                action: 'DELETE_PROFESSOR',
                table_name: 'professors',
                record_id: id,
                old_values: JSON.stringify(professor),
                new_values: null,
                ip_address: user.ip,
                user_agent: user.userAgent,
                created_at: new Date()
            }, { transaction });

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = ProfessorService;