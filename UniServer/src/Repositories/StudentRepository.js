const {Op} = require('sequelize');
const Student = require('../DomainModels/Student');
const Program = require('../DomainModels/Program');
const Faculty = require('../DomainModels/Faculty');
const Account = require('../DomainModels/Account');
const bcrypt = require("bcrypt");

class StudentRepository {
    constructor(sequelize) {
        this.sequelize = sequelize;
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
            if (plainData.Program.Faculty) {
                student.program.faculty = new Faculty(plainData.Program.Faculty)
            }
        }


        if (plainData.Account) {
            student.firstName = plainData.Account.first_name;
            student.lastName = plainData.Account.last_name;
            student.account = new Account(plainData.Account)
        }

        return student;
    };


    async getAllStudents() {
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
                    }]
                }
            ],
            attributes: ['student_id', 'student_number', 'account_id'],
            where: {},
            limit: 10,
            offset: ((1) - 1) * (10),
        };

        try {
            const {rows, count} = await this.Student.findAndCountAll(queryOptions);

            return {
                data: rows.map(student => this.toDomainModel(student)),
                total: count,
                page: 1,
                limit: 10
            };
        } catch (error) {
            console.error('Database query error::', {
                error: error.message,
                sql: error.sql
            });
            throw new Error(`Failed to find all students: ${error.message}`);
        }
    }

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
                        where: filters.facultyId ? {id: filters.facultyId} : undefined
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
                    {first_name: {[Op.like]: `%${filters.name}%`}},
                    {last_name: {[Op.like]: `%${filters.name}%`}}
                ]
            };
        }

        if (filters.studentCode) {
            queryOptions.where.student_number = {[Op.like]: `%${filters.studentCode}%`};
        }

        try {
            const {rows, count} = await this.Student.findAndCountAll(queryOptions);

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

    async findById(studentId) {
        try {
            const student = await this.Student.findOne({
                where: {student_id: studentId},
                include: [
                    {
                        model: this.Account,
                        required: true,
                        attributes: ['first_name', 'last_name', 'account_id']
                    },
                ],
                attributes: ['student_id', 'student_number', 'account_id', 'status']
            });

            if (!student) {
                throw new Error(`Student with ID ${studentId} not found`);
            }

            return this.toDomainModel(student);
        } catch (error) {
            if (error.message.includes('not found')) {
                throw error;
            }
            throw new Error(`Failed to fetch student: ${error.message}`);
        }
    }

    async create(studentData, options = {}) {
        try {
            const student = await this.Student.create({
                account_id: studentData.account_id,
                program_id: studentData.program_id,
                student_number: studentData.student_number,
                semester: studentData.semester,
                status: 'Active',
                enrollment_date: studentData.enrollment_date || new Date(),
                expected_graduation: studentData.expected_graduation,
                created_at: new Date()
            }, {
                transaction: options.transaction,
            });
            return this.toDomainModel(student);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error(`Student with code ${studentData.studentCode} already exists`);
            }
            throw new Error(`Failed to create student: ${error.message}`);
        }
    }

    async delete(studentId, options = {}) {
        try {
            const result = await this.Student.destroy({
                where: {student_id: studentId},
                transaction: options.transaction
            });

            if (result === 0) {
                throw new Error(`Student with ID ${studentId} not found`);
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to delete student: ${error.message}`);
        }
    }

    async update(studentId, updateData, options = {}) {
        try {
            const student = await this.Student.findOne({
                where: {student_id: studentId},
                transaction: options.transaction
            });

            if (!student) {
                throw new Error(`Student with ID ${studentId} not found`);
            }

            await student.update({
                program_id: updateData.program_id,
                student_number: updateData.student_number,
                semester: updateData.semester,
                status: updateData.status,
                enrollment_date: updateData.enrollment_date,
                expected_graduation: updateData.expected_graduation,
                updated_at: new Date()
            }, {
                transaction: options.transaction
            });
            return student;
        } catch (error) {
            throw new Error(`Failed to update student: ${error.message}`);
        }
    }

}


module.exports = StudentRepository;