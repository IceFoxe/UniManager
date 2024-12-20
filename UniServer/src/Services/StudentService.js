const bcrypt = require("bcrypt");

class StudentService {
    constructor(studentRepository, logRepository, accountRepository) {
        this.studentRepository = studentRepository;
        this.logRepository = logRepository;
        this.accountRepository = accountRepository;
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

    async createStudent(studentData, userData) {
        if (!studentData.program_id || !studentData.student_number) {
            throw new Error('Required fields missing');
        }
        const t = await this.studentRepository.sequelize.transaction();
        try {
            const login = `${studentData.first_name.slice(0, 3).toLowerCase()}${studentData.last_name.slice(0, 3).toLowerCase()}${studentData.student_number.slice(2, 6)}`;
            const acc = await this.accountRepository.create({
                login: login,
                email: `${studentData.student_number}@gmail.com`,
                password_hash: await bcrypt.hash(studentData.student_number, 10),
                first_name: studentData.first_name,
                last_name: studentData.last_name,
                role: 'Student',
            }, {transaction: t});

            const accountLog = await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'CREATE',
                table_name: 'account',
                record_id: acc.id,
                old_values: '',
                new_values: JSON.stringify(studentData),
            }, {transaction: t});

            const student = await this.studentRepository.create( {
                account_id: acc.id,
                first_name: studentData.first_name,
                last_name: studentData.last_name,
                student_number: studentData.student_number,
                program_id: studentData.program_id,
                status: studentData.status || 'Active',
                enrollment_date: studentData.enrollment_date || new Date(),
                expected_graduation: studentData.expected_graduation,
                semester: studentData.semester || 1
            }, {transaction: t});

            const studentLog = await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'CREATE',
                table_name: 'student',
                record_id: student.id,
                old_values: '',
                new_values: JSON.stringify(studentData),
            }, {transaction: t});
            t.commit();
            return {id: student.id};
        } catch (error) {
            t.rollback();
            throw new Error(`Failed to create student: ${error.message}`);
        }
    }

    async deleteStudentById(id, userData) {
        const t = await this.studentRepository.sequelize.transaction();
        try {
            const student = await this.studentRepository.findById(id, {transaction: t});
            if (!student) {
                throw new Error('Student not found');
            }

            const oldValues = JSON.stringify(student);

            await this.studentRepository.delete(id, {transaction: t});
            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'DELETE',
                table_name: 'student',
                record_id: id,
                old_values: oldValues,
                new_values: '',
            }, {transaction: t});

            await this.accountRepository.delete(student.account.id, {transaction: t});
            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'DELETE',
                table_name: 'account',
                record_id: student.account_id,
                old_values: oldValues,
                new_values: '',
            }, {transaction: t});

            await t.commit();
            return {success: true};
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to delete student: ${error.message}`);
        }
    }

    async updateStudentById(id, updateData, userData) {
        const t = await this.studentRepository.sequelize.transaction();
        try {
            const student = await this.studentRepository.findById(id, {transaction: t});
            if (!student) {
                throw new Error('Student not found');
            }
            
            if (userData.role === 'student' && userData.userId !== student.account_id) {
                throw new Error('Unauthorized to update this student record');
            }

            const oldValues = JSON.stringify(student);
            const updatedStudent = await this.studentRepository.update(id, updateData, {transaction: t});

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'UPDATE',
                table_name: 'student',
                record_id: id,
                old_values: oldValues,
                new_values: JSON.stringify(updateData),
            }, {transaction: t});

            await t.commit();
            return updatedStudent;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to update student: ${error.message}`);
        }
    }

    async sudoUpdateStudentById(id, updateData, userData) {
        const t = await this.studentRepository.sequelize.transaction();
        try {
            const student = await this.studentRepository.findById(id, {transaction: t});
            if (!student) {
                throw new Error('Student not found');
            }

            const oldValues = JSON.stringify(student);

            // Update both student and account information
            const updatedStudent = await this.studentRepository.update(id, updateData.student, {transaction: t});
            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'SUDO_UPDATE',
                table_name: 'student',
                record_id: id,
                old_values: oldValues,
                new_values: JSON.stringify(updateData.student),
            }, {transaction: t});

            if (updateData.account) {
                const oldAccountValues = JSON.stringify(await this.accountRepository.findById(student.account_id));
                await this.accountRepository.update(student.account_id, updateData.account, {transaction: t});
                await this.logRepository.create({
                    account_id: userData.userId,
                    timestamp: new Date(),
                    action: 'SUDO_UPDATE',
                    table_name: 'account',
                    record_id: student.account_id,
                    old_values: oldAccountValues,
                    new_values: JSON.stringify(updateData.account),
                }, {transaction: t});
            }

            await t.commit();
            return updatedStudent;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to sudo update student: ${error.message}`);
        }
    }
}

module.exports = StudentService;
