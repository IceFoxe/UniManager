class GradeService {
    constructor(gradeRepository, logRepository) {
        this.gradeRepository = gradeRepository;
        this.logRepository = logRepository;
    }

    async createGrade(gradeData, userData) {
        if (!gradeData.student_id || !gradeData.course_id || !gradeData.value) {
            throw new Error('Required fields missing');
        }

        if (gradeData.value < 2.0 || gradeData.value > 5.5) {
            throw new Error('Grade value must be between 2.0 and 5.5');
        }

        const t = await this.gradeRepository.sequelize.transaction();
        try {
            const grade = await this.gradeRepository.create(gradeData, { transaction: t });

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'CREATE',
                table_name: 'grade',
                record_id: grade.id,
                old_values: '',
                new_values: JSON.stringify(gradeData),
            }, { transaction: t });

            await t.commit();
            return grade;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to create grade: ${error.message}`);
        }
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

    async updateGrade(id, gradeData, userData) {
        if (gradeData.value !== undefined) {
            if (gradeData.value < 2.0 || gradeData.value > 5.5) {
                throw new Error('Grade value must be between 2.0 and 5.5');
            }

            gradeData.value = Math.round(gradeData.value * 2) / 2;
        }

        const t = await this.gradeRepository.sequelize.transaction();
        try {
            const oldGrade = await this.gradeRepository.findById(id);
            if (!oldGrade) {
                throw new Error('Grade not found');
            }

            const updatedGrade = await this.gradeRepository.update(id, gradeData, { transaction: t });

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'UPDATE',
                table_name: 'grade',
                record_id: id,
                old_values: JSON.stringify(oldGrade),
                new_values: JSON.stringify(gradeData),
            }, { transaction: t });

            await t.commit();
            return updatedGrade;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to update grade: ${error.message}`);
        }
    }

    async deleteGrade(id, userData) {
        const t = await this.gradeRepository.sequelize.transaction();
        try {
            const grade = await this.gradeRepository.findById(id);
            if (!grade) {
                throw new Error('Grade not found');
            }

            await this.gradeRepository.delete(id, { transaction: t });

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'DELETE',
                table_name: 'grade',
                record_id: id,
                old_values: JSON.stringify(grade),
                new_values: '',
            }, { transaction: t });

            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to delete grade: ${error.message}`);
        }
    }
}

module.exports = GradeService;