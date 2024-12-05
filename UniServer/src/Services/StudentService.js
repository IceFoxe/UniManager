class StudentService {
    constructor(studentRepository) {
        this.studentRepository = studentRepository;
    }

    async searchStudents(queryParams) {
        const filters = {
            facultyId: queryParams.facultyId,
            courseId: queryParams.courseId,
            name: queryParams.name,
            surname: queryParams.surname,
            studentCode: queryParams.studentCode,
            page: parseInt(queryParams.page) || 1,
            limit: parseInt(queryParams.limit) || 10
        };

        const result = await this.studentRepository.searchStudents(filters);

        return {
            data: result.data.map(student => ({
                id: student.id,
                fullName: student.fullName,
                studentCode: student.studentCode,
                academicStanding: student.academicStanding,
                programName: student.program?.name,
                facultyName: student.program?.faculty?.name
            })),
            metadata: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            }
        };
    }
    async getStudentById(id) {
        const student = await this.studentRepository.findById(id);
        if (!student) return null;

        return {
            id: student.id,
            fullName: student.fullName,
            studentCode: student.studentCode,
            academicStanding: student.academicStanding,
            enrollmentStatus: student.enrollmentStatus,
            programName: student.program?.name,
            facultyName: student.program?.faculty?.name,
            advisor: student.advisor?.fullName
        };
    }
}

module.exports = StudentService;
