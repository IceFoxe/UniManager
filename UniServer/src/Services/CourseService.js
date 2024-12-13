class CourseService {
    constructor(courseRepository) {
        this.courseRepository = courseRepository;
    }

    async createCourse(courseData) {
        if (!courseData.program_id || !courseData.teacher_id || !courseData.name || !courseData.code) {
            throw new Error('Required fields missing');
        }

        return await this.courseRepository.create(courseData);
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

    async updateCourse(id, courseData) {
        return await this.courseRepository.update(id, courseData);
    }

    async deleteCourse(id) {
        return await this.courseRepository.delete(id);
    }

    async getCourseStudents(courseId) {
        return await this.courseRepository.getStudentsInCourse(courseId);
    }

    async getTeacherCourses(teacherId) {
        return await this.courseRepository.getCoursesByTeacher(teacherId);
    }
}