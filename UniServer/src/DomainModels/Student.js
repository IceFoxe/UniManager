class Student {
  constructor(data) {
    this.id = data.student_id;
    this.studentCode = data.student_number;
    this.firstName = null;
    this.lastName = null;
    this.year = data.year;
    this._program = null;
    this._grades = [];
    this._account = null;
  }

  get account (){
    return this._account;
  }
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  set account(account) {
    this._account = account;
  }

  get academicStanding() {
    const average = this.calculateGradeAverage();
    if (average >= 4.5) return 'Excellent';
    if (average >= 4) return 'Good';
    if (average >= 3.0) return 'Passing';
    return 'Failing';
  }


  calculateGradeAverage() {
    if (this._grades.length === 0) return 0;
    return this._grades.reduce((sum, grade) => sum + grade.value, 0) / this._grades.length;
  }

  get program() {
    return this._program;
  }

  set program(program) {
    this._program = program;
  }
}
module.exports = Student;