function applyExtraSetup(sequelize) {
	const { Account, AuditLog, Course, Employee, Faculty, FacultyProgram, Program, Grade, Professor, Student } = sequelize.models;

	Account.hasOne(Student, {
        foreignKey: 'account_id'
    });
    Student.belongsTo(Account, {
        foreignKey: 'account_id'
    });

    Account.hasOne(Employee, {
        foreignKey: 'account_id'
    });
    Employee.belongsTo(Account, {
        foreignKey: 'account_id'
    });

    Account.hasMany(AuditLog, {
        foreignKey: 'account_id'
    });
    AuditLog.belongsTo(Account, {
        foreignKey: 'account_id'
    });

    Employee.hasOne(Professor, {
        foreignKey: 'employee_id'
    });
    Professor.belongsTo(Employee, {
        foreignKey: 'employee_id'
    });

    Faculty.hasMany(Program, {
        foreignKey: 'facultyId'
    });
    Program.belongsTo(Faculty, {
        foreignKey: 'facultyId'
    });

    Program.hasMany(Course, {
        foreignKey: 'program_id'
    });
    Course.belongsTo(Program, {
        foreignKey: 'program_id'
    });

    Program.hasMany(Student, {
        foreignKey: 'program_id'
    });
    Student.belongsTo(Program, {
        foreignKey: 'program_id'
    });

    // Professor relationships
    Professor.hasMany(Course, {
        foreignKey: 'professor_id'
    });
    Course.belongsTo(Professor, {
        foreignKey: 'professor_id'
    });

    // Course relationships
    Course.hasMany(Grade, {
        foreignKey: 'course_id'
    });
    Grade.belongsTo(Course, {
        foreignKey: 'course_id'
    });


    Student.hasMany(Grade, {
        foreignKey: 'student_id'
    });
    Grade.belongsTo(Student, {
        foreignKey: 'student_id'
    });
}

module.exports = { applyExtraSetup };