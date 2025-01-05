class CourseService {
    constructor(courseRepository, logRepository) {
        this.courseRepository = courseRepository;
        this.logRepository = logRepository;
    }

    async createCourse(courseData, userData) {
        if (!courseData.program_id || !courseData.teacher_id || !courseData.name || !courseData.code) {
            throw new Error('Required fields missing');
        }

        const t = await this.courseRepository.sequelize.transaction();
        try {
            const course = await this.courseRepository.create(courseData, { transaction: t });

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'CREATE',
                table_name: 'course',
                record_id: course.id,
                old_values: '',
                new_values: JSON.stringify(courseData),
            }, { transaction: t });

            await t.commit();
            //return course;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to create course: ${error.message}`);
        }
    }

    async getCourseById(id) {
        const course = await this.courseRepository.findById(id);
        if (!course) return null;

        return {
            id: course.id,
            name: course.name,
            code: course.code,
            credits: course.credits,
            semester: course.semester,
            mandatory: course.mandatory,
            programName: course.program?.name,
            teacherName: `${course.teacher?.firstName} ${course.teacher?.lastName}`
        };
    }

    async getAllCourses(query) {
        const result = await this.courseRepository.getAll({
            page: parseInt(query.page) || 1,
            limit: parseInt(query.limit) || 10,
            semester: query.semester,
            mandatory: query.mandatory === 'true' ? true : query.mandatory === 'false' ? false : undefined
        });

        return {
            data: result.data.map(course => ({
                id: course.id,
                name: course.name,
                code: course.code,
                credits: course.credits,
                semester: course.semester,
                mandatory: course.mandatory,
                programName: course.program?.name,
                teacherName: `${course.teacher?.firstName} ${course.teacher?.lastName}`
            })),
            metadata: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            }
        };
    }

    async getCoursesByProgram(programId, query) {
        const result = await this.courseRepository.findByProgramId(programId, {
            semester: query.semester
        });

        return {
            data: result.data.map(course => ({
                id: course.id,
                name: course.name,
                code: course.code,
                credits: course.credits,
                semester: course.semester,
                mandatory: course.mandatory,
                teacherName: `${course.teacher?.firstName} ${course.teacher?.lastName}`
            })),
            total: result.total
        };
    }

    async updateCourse(id, courseData, userData) {
        const t = await this.courseRepository.sequelize.transaction();
        try {
            const oldCourse = await this.courseRepository.findById(id);
            if (!oldCourse) {
                throw new Error('Course not found');
            }

            const updatedCourse = await this.courseRepository.update(id, courseData, { transaction: t });

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'UPDATE',
                table_name: 'course',
                record_id: id,
                old_values: JSON.stringify(oldCourse),
                new_values: JSON.stringify(courseData),
            }, { transaction: t });

            await t.commit();
            return updatedCourse;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to update course: ${error.message}`);
        }
    }

    async deleteCourse(id, userData) {
        const t = await this.courseRepository.sequelize.transaction();
        try {
            const course = await this.courseRepository.findById(id);
            if (!course) {
                throw new Error('Course not found');
            }

            await this.courseRepository.delete(id, { transaction: t });

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'DELETE',
                table_name: 'course',
                record_id: id,
                old_values: JSON.stringify(course),
                new_values: '',
            }, { transaction: t });

            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to delete course: ${error.message}`);
        }
    }

    async getCourseStudents(courseId) {
        return await this.courseRepository.getStudentsInCourse(courseId);
    }

    async getTeacherCourses(teacherId) {
        return await this.courseRepository.getCoursesByTeacher(teacherId);
    }
}

module.exports = CourseService;