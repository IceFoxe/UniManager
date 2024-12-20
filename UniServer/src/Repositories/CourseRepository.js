const Student = require('../DomainModels/Student');
const Program = require('../DomainModels/Program');
const Professor = require('../DomainModels/Professor');

class CourseRepository {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.Course = sequelize.models.Course;
        this.Program = sequelize.models.Program;
        this.Professor = sequelize.models.Professor;
        this.Student = sequelize.models.Student;
    }

    toDomainModel(dbModel) {
        const plainData = dbModel.get({ plain: true });
        const course = new Course(plainData);

        if (plainData.Program) {
            course.program = new Program(plainData.Program);
        }

        if (plainData.Professor) {
            course.Professor = new Professor(plainData.Professor);
        }

        if (plainData.Students) {
            course.students = plainData.Students.map(student => new Student(student));
        }

        return course;
    }

    async create(courseData) {
        const t = await this.sequelize.transaction();
        try {
            const course = await this.Course.create({
                program_id: courseData.program_id,
                Professor_id: courseData.Professor_id,
                name: courseData.name,
                code: courseData.code,
                credits: courseData.credits,
                semester: courseData.semester,
                mandatory: courseData.mandatory,
                created_at: new Date()
            }, { transaction: t });

            await t.commit();
            return this.toDomainModel(course);
        } catch (error) {
            await t.rollback();
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error(`Course with code ${courseData.code} already exists`);
            }
            throw new Error(`Failed to create course: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const course = await this.Course.findOne({
                where: { course_id: id },
                include: [
                    {
                        model: this.Program,
                        required: true,
                    },
                    {
                        model: this.Professor,
                        required: true,
                        attributes: ['Professor_id', 'first_name', 'last_name']
                    }
                ]
            });

            if (!course) {
                throw new Error(`Course with ID ${id} not found`);
            }

            return this.toDomainModel(course);
        } catch (error) {
            throw new Error(`Failed to fetch course: ${error.message}`);
        }
    }

    async getAll(options = {}) {
        const { page = 1, limit = 10} = options;
        try {
            const queryOptions = {
                include: [
                    {
                        model: this.Program,
                        required: true,
                    },
                    {
                        model: this.Professor,
                        required: true,
                        attributes: ['Professor_id', 'first_name', 'last_name']
                    }
                ],
                limit,
                offset: (page - 1) * limit
            };

            const { rows, count } = await this.Course.findAndCountAll(queryOptions);

            return {
                data: rows.map(course => this.toDomainModel(course)),
                total: count,
                page,
                limit
            };
        } catch (error) {
            throw new Error(`Failed to fetch courses: ${error.message}`);
        }
    }

    async findByProgramId(programId, options = {}) {
        const { semester } = options;
        try {
            const queryOptions = {
                where: { program_id: programId },
                include: [
                    {
                        model: this.Program,
                        required: true,
                    },
                    {
                        model: this.Professor,
                        required: true,
                        attributes: ['Professor_id', 'first_name', 'last_name']
                    }
                ]
            };

            if (semester) queryOptions.where.semester = semester;

            const { rows, count } = await this.Course.findAndCountAll(queryOptions);

            return {
                data: rows.map(course => this.toDomainModel(course)),
                total: count
            };
        } catch (error) {
            throw new Error(`Failed to fetch program courses: ${error.message}`);
        }
    }

    async update(id, courseData) {
        try {
            const course = await this.Course.findByPk(id);
            if (!course) {
                throw new Error(`Course with ID ${id} not found`);
            }

            await course.update(courseData);
            return this.toDomainModel(course);
        } catch (error) {
            throw new Error(`Failed to update course: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const course = await this.Course.findByPk(id);
            if (!course) {
                throw new Error(`Course with ID ${id} not found`);
            }

            await course.destroy();
            return true;
        } catch (error) {
            throw new Error(`Failed to delete course: ${error.message}`);
        }
    }

    async getStudentsInCourse(courseId) {
        try {
            const course = await this.Course.findOne({
                where: { course_id: courseId },
                include: [{
                    model: this.Student,
                    through: { attributes: [] }  // Exclude junction table attributes
                }]
            });

            if (!course) {
                throw new Error(`Course with ID ${courseId} not found`);
            }

            return {
                data: course.Students.map(student => new Student(student)),
                total: course.Students.length
            };
        } catch (error) {
            throw new Error(`Failed to fetch course students: ${error.message}`);
        }
    }

    async getCoursesByProfessor(ProfessorId) {
        try {
            const { rows, count } = await this.Course.findAndCountAll({
                where: { Professor_id: ProfessorId },
                include: [{
                    model: this.Program,
                    required: true
                }]
            });

            return {
                data: rows.map(course => this.toDomainModel(course)),
                total: count
            };
        } catch (error) {
            throw new Error(`Failed to fetch Professor courses: ${error.message}`);
        }
    }
}
module.exports = CourseRepository;