class StudentService {
    constructor(studentRepository) {
        this.studentRepository = studentRepository;
    }

    async getAllStudents() {
        const result = await this.studentRepository.getAllStudents();

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
            status: student.status,
        };
    }

    async createStudent(studentData) {
        if (!studentData.program_id || !studentData.student_number) {
            throw new Error('Required fields missing');
        }

        const student = await this.studentRepository.create({
            first_name: studentData.first_name,
            last_name: studentData.last_name,
            student_number: studentData.student_number,
            program_id: studentData.program_id,
            status: studentData.status || 'Active',
            enrollment_date: studentData.enrollment_date || new Date(),
            expected_graduation: studentData.expected_graduation,
            semester: studentData.semester || 1
        });

        return {id: student.student_id};
    }
}

module.exports = StudentService;
