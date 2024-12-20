class StudentController {
    constructor(studentService) {
        this.studentService = studentService;
    }

    async getAllStudents(req, res) {
        try {
            const result = await this.studentService.getAllStudents(req.query);
            res.json(result);
        } catch (error) {
            console.error('Failed to fetch students:', error);
            res.status(500).json({
                error: 'Failed to fetch all students',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async searchStudents(req, res) {
        try {
            const result = await this.studentService.searchStudents(req.query);
            res.json(result);
        } catch (error) {
            console.error('Failed to search students:', error);
            res.status(500).json({
                error: 'Failed to fetch students',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async createStudent(req, res) {
        try {
            const faculty = await this.studentService.createStudent(req.body, req.user);
            res.status(201).json(faculty);
        } catch (error) {
            console.error('Failed to create student:', error);
            res.status(400).json({error: error.message});
        }
    }

    async getStudentById(req, res) {
        try {
            const student = await this.studentService.getStudentById(req.params.id);
            if (!student) {
                return res.status(404).json({error: 'Student not found'});
            }
            res.json(student);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async delStudentById(req, res) {
        try {
            await this.studentService.deleteStudentById(req.params.id, req.user);
            res.status(200).json({message: 'Student deleted successfully'});
        } catch (error) {
            console.error('Failed to delete student:', error);
            res.status(error.message.includes('not found') ? 404 : 500).json({
                error: 'Failed to delete student',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async updateStudentById(req, res) {
        try {
            const updatedStudent = await this.studentService.updateStudentById(
                req.params.id,
                req.body,
                req.user
            );
            res.json(updatedStudent);
        } catch (error) {
            console.error('Failed to update student:', error);
            const status = error.message.includes('Unauthorized') ? 403
                : error.message.includes('not found') ? 404 : 500;
            res.status(status).json({
                error: 'Failed to update student',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async sudoUpdateStudentById(req, res) {
        try {
            const updatedStudent = await this.studentService.sudoUpdateStudentById(
                req.params.id,
                req.body,
                req.user
            );
            res.json(updatedStudent);
        } catch (error) {
            console.error('Failed to sudo update student:', error);
            const status = error.message.includes('not found') ? 404 : 500;
            res.status(status).json({
                error: 'Failed to sudo update student',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = StudentController;
