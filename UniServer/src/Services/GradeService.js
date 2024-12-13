class GradeService {
    constructor(gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    async createGrade(gradeData) {
        if (!gradeData.student_id || !gradeData.group_id || !gradeData.value) {
            throw new Error('Required fields missing');
        }

        // Validate grade value
        if (gradeData.value < 2.0 || gradeData.value > 5.5) {
            throw new Error('Grade value must be between 2.0 and 5.5');
        }

        return await this.gradeRepository.create(gradeData);
    }

    async getStudentGrades(studentId) {
        const result = await this.gradeRepository.findByStudentId(studentId);

        return {
            data: result.data.map(grade => ({
                id: grade.id,
                value: grade.value.toFixed(1),
                description: grade.getDescription(),
                date: grade.date,
                groupName: grade.group?.name,
                passed: grade.isPassing()
            })),
            total: result.total
        };
    }

    async getGroupGrades(groupId) {
        const result = await this.gradeRepository.findByGroupId(groupId);

        return {
            data: result.data.map(grade => ({
                id: grade.id,
                studentName: grade.student?.fullName,
                value: grade.value.toFixed(1),
                description: grade.getDescription(),
                date: grade.date,
                passed: grade.isPassing()
            })),
            statistics: {
                average: this.calculateAverage(result.data),
                highest: this.findHighestGrade(result.data),
                lowest: this.findLowestGrade(result.data),
                passingRate: this.calculatePassingRate(result.data)
            },
            total: result.total
        };
    }

    calculateAverage(grades) {
        if (!grades.length) return 0;
        const sum = grades.reduce((acc, grade) => acc + grade.value, 0);
        return (sum / grades.length).toFixed(2);
    }

    findHighestGrade(grades) {
        if (!grades.length) return 0;
        return Math.max(...grades.map(grade => grade.value));
    }

    findLowestGrade(grades) {
        if (!grades.length) return 0;
        return Math.min(...grades.map(grade => grade.value));
    }

    calculatePassingRate(grades) {
        if (!grades.length) return 0;
        const passingGrades = grades.filter(grade => grade.isPassing());
        return ((passingGrades.length / grades.length) * 100).toFixed(1);
    }

    async updateGrade(id, gradeData) {
        if (gradeData.value !== undefined) {
            if (gradeData.value < 2.0 || gradeData.value > 5.5) {
                throw new Error('Grade value must be between 2.0 and 5.5');
            }
            // Round to nearest 0.5
            gradeData.value = Math.round(gradeData.value * 2) / 2;
        }

        return await this.gradeRepository.update(id, gradeData);
    }

    async deleteGrade(id) {
        return await this.gradeRepository.delete(id);
    }
}

module.exports = GradeService;