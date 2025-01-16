class CourseController {
    constructor(courseService) {
        this.courseService = courseService;
    }

    async createCourse(req, res) {
        try {
            const course = await this.courseService.createCourse(req.body, req.user);
            res.status(201).json(course);
        } catch (error) {
            console.error('Failed to create course:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async getCourseById(req, res) {
        try {
            const course = await this.courseService.getCourseById(req.params.id);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
            res.json(course);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllCourses(req, res) {
        try {
            const result = await this.courseService.getAllCourses(req.query);
            res.json(result);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            res.status(500).json({
                error: 'Failed to fetch all courses',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async getCoursesByProgram(req, res) {
        try {
            const result = await this.courseService.getCoursesByProgram(req.params.programId, req.query);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCoursesByStudentId(req, res) {
        try {
            const result = await this.courseService.getCoursesByStudentId(req.params.studentId, req.query);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateCourse(req, res) {
        try {
            const course = await this.courseService.updateCourse(req.params.id, req.body);
            res.json(course);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteCourse(req, res) {
        try {
            await this.courseService.deleteCourse(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCourseStudents(req, res) {
        try {
            const result = await this.courseService.getCourseStudents(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTeacherCourses(req, res) {
        try {
            const result = await this.courseService.getTeacherCourses(req.params.teacherId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CourseController;