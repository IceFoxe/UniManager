const Student = require('../DomainModels/Student');
const Course = require('../DomainModels/Course');
const Grade = require('../DomainModels/Grade');

const Account = require('../DomainModels/Account');

class GradeRepository {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.Grade = sequelize.models.Grade;
        this.Student = sequelize.models.Student;
        this.Course = sequelize.models.Course;
        this.Group = sequelize.models.Group;
    }

    toDomainModel(dbModel) {
        const plainData = dbModel.get({plain: true});
        const grade = new Grade(plainData);

        if (plainData.Student) {
            grade.student = new Student(plainData.Student);
        }

        if (plainData.Course){
            grade.course = new Course(plainData.Course);
        }


        return grade;
    }

    async create(gradeData, options = {}) {
        const t = await this.sequelize.transaction();
        try {
            const student = await this.Student.findByPk(gradeData.student_id);
            if (!student) {
                throw new Error('Student not found');
            }

            const roundedGrade = Math.round(gradeData.value * 2) / 2;

            const grade = await this.Grade.create({
                student_id: gradeData.student_id,
                group_id: gradeData.course_id,
                value: roundedGrade,
                description: gradeData.description,
                date: gradeData.date || new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            }, {transaction: options.transaction});

            await t.commit();
            return this.toDomainModel(grade);
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to create grade: ${error.message}`);
        }
    }

    async findByStudentId(studentId) {
        try {
            const {rows, count} = await this.Grade.findAndCountAll({
                where: {student_id: studentId},
                include: [
                    {
                        model: this.Student,
                        required: true
                    },
                    {
                        model: this.Course,
                        required: true
                    }
                ],
                order: [['date', 'DESC']]
            });

            return {
                data: rows.map(grade => this.toDomainModel(grade)),
                total: count
            };
        } catch (error) {
            throw new Error(`Failed to fetch student grades: ${error.message}`);
        }
    }

    async findById(Id) {
        const numericId = parseInt(Id, 10);

        if (isNaN(numericId)) {
            throw new Error('Invalid ID format - must be a number');
        }

        try {
            const grade = await this.Grade.findByPk(numericId);

            if (!grade) {
                return null;
            }

            return this.toDomainModel(grade);
        } catch (error) {
            throw new Error(`Failed to fetch student grade: ${error.message}`);
        }
    }

    async findByGroupId(groupId) {
        try {
            const {rows, count} = await this.Grade.findAndCountAll({
                where: {group_id: groupId},
                include: [
                    {
                        model: this.Student,
                        required: true
                    },
                    {
                        model: this.Group,
                        required: true
                    }
                ],
                order: [['date', 'DESC']]
            });

            return {
                data: rows.map(grade => this.toDomainModel(grade)),
                total: count
            };
        } catch (error) {
            throw new Error(`Failed to fetch group grades: ${error.message}`);
        }
    }

    async update(id, gradeData, options = {}) {
        try {
            const grade = await this.Grade.findByPk(id);
            if (!grade) {
                throw new Error(`Grade with ID ${id} not found`);
            }

            await grade.update({
                ...gradeData,
                updatedAt: new Date(),
                transaction: options.transaction
            });

            return this.toDomainModel(grade);
        } catch (error) {
            throw new Error(`Failed to update grade: ${error.message}`);
        }
    }

    async delete(id, options = {}) {
        try {
            const grade = await this.Grade.findByPk(id);
            if (!grade) {
                throw new Error(`Grade with ID ${id} not found`);
            }

            await grade.destroy({transaction: options.transaction});
            return true;
        } catch (error) {
            throw new Error(`Failed to delete grade: ${error.message}`);
        }
    }

    async getStudentGroupGrade(studentId, groupId) {
        try {
            const grade = await this.Grade.findOne({
                where: {
                    student_id: studentId,
                    group_id: groupId
                },
                include: [
                    {
                        model: this.Student,
                        required: true
                    },
                    {
                        model: this.Group,
                        required: true
                    }
                ]
            });

            return grade ? this.toDomainModel(grade) : null;
        } catch (error) {
            throw new Error(`Failed to fetch student group grade: ${error.message}`);
        }
    }
}

module.exports = GradeRepository;