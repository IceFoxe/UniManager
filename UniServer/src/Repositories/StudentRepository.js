const {Op} = require('sequelize');
const Student = require('../DomainModels/Student');
const Program = require('../DomainModels/Program');
const Account = require('../DomainModels/Account');

class StudentRepository {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.dialect = sequelize.getDialect();
        this.Student = sequelize.models.Student;
        this.Program = sequelize.models.Program;
        this.Faculty = sequelize.models.Faculty;
        this.Account = sequelize.models.Account;
    }

    toDomainModel(dbModel) {
        const plainData = dbModel.get({plain: true});
        const student = new Student(plainData);

        if (plainData.Program) {
            student.program = new Program(plainData.Program);
        }

        if (plainData.Account) {
            student.firstName = plainData.Account.first_name;
            student.lastName = plainData.Account.last_name;
            student.account = new Account(plainData.Account)
        }

        return student;
    };



    async searchStudents(filters) {
        const queryOptions = {
            include: [
                {
                    model: this.Account,
                    required: true,
                    attributes: ['first_name', 'last_name', 'account_id']
                },
                {
                    model: this.Program,
                    required: true,
                    attributes: ['id', 'name', 'code'],
                    include: [{
                        model: this.Faculty,
                        required: true,
                        where: filters.facultyId ? { id: filters.facultyId } : undefined
                    }]
                }
            ],
            attributes: ['student_id', 'student_number', 'account_id'],
            where: {},
            limit: filters.limit || 10,
            offset: ((filters.page || 1) - 1) * (filters.limit || 10),
        };

        if (filters.name) {
            queryOptions.include[0].where = {
                [Op.or]: [
                    { first_name: { [Op.like]: `%${filters.name}%` } },
                    { last_name: { [Op.like]: `%${filters.name}%` } }
                ]
            };
        }

        if (filters.studentCode) {
            queryOptions.where.student_number = { [Op.like]: `%${filters.studentCode}%` };
        }

        try {
            const { rows, count } = await this.Student.findAndCountAll(queryOptions);

            return {
                data: rows.map(student => this.toDomainModel(student)),
                total: count,
                page: filters.page || 1,
                limit: filters.limit || 10
            };
        } catch (error) {
            console.error('Database query failed:', {
                error: error.message,
                sql: error.sql
            });
            throw new Error(`Failed to search students: ${error.message}`);
        }
    }
}


module.exports = StudentRepository;