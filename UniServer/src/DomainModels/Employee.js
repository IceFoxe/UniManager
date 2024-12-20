class Employee {
    constructor(data) {
        this.id = data.employee_id;
        this.position = data.position;
        this.employmentDate = data.employment_date;
        this._account = null;
    }

    get account() {
        return this._account;
    }

    set account(account) {
        this._account = account;
    }

    get isAdministrator() {
        return this.position === 'Administrator';
    }

    get isTeachingStaff() {
        return ['Teacher', 'Professor', 'Department Head', 'Dean'].includes(this.position);
    }

    get employmentDuration() {
        const today = new Date();
        const startDate = new Date(this.employmentDate);
        const diffTime = Math.abs(today - startDate);
        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
        return diffYears;
    }

    canApproveGrades() {
        return this.isTeachingStaff || this.isAdministrator;
    }

    canManageUsers() {
        return this.isAdministrator;
    }

    canAccessDepartmentRecords() {
        return this.position === 'Department Head' || this.position === 'Dean' || this.isAdministrator;
    }

    hasPosition(position) {
        return this.position === position;
    }
}

module.exports = Employee;