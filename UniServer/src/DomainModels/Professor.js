const {sequelize} = require("../Config/DataBaseConfig");

class Professor {
    static ACADEMIC_TITLES = ['Assistant Professor', 'Associate Professor', 'Full Professor'];

    constructor(data) {
        this.id = data.id;
        this.facultyId = data.facultyId;
        this.employee_Id = data.employee_Id;
        this.academicTitle = data.academicTitle || 'Assistant Professor';
        this.officeRoom = data.officeRoom;
        this.createdAt = data.createdAt || new Date();
        this._employee = null;
    }

    get employee() {
        return this._employee;
    }

    set employee(employee) {
        this._employee = employee;
    }
    validate() {
        if (!this.facultyId || !Number.isInteger(this.facultyId)) {
            throw new Error('Invalid faculty ID');
        }
        if (!this.employee_Id || !Number.isInteger(this.employee_Id)) {
            throw new Error('Invalid employee ID');
        }
        if (!Professor.ACADEMIC_TITLES.includes(this.academicTitle)) {
            throw new Error('Invalid academic title');
        }
        if (this.officeRoom && !/^[A-Z0-9-]+$/.test(this.officeRoom)) {
            throw new Error('Invalid office room format');
        }
        return true;
    }

    toJSON() {
        return {
            id: this.id,
            facultyId: this.facultyId,
            employee_Id: this.employee_Id,
            academicTitle: this.academicTitle,
            officeRoom: this.officeRoom,
            createdAt: this.createdAt
        };
    }
}

module.exports = Professor;