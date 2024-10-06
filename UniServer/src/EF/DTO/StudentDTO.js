class StudentDTO {
  constructor(id, firstName, lastName, studentNumber, majorId, accountId) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.studentNumber = studentNumber;
    this.majorId = majorId;
    this.accountId = accountId;
  }
}

module.exports = StudentDTO;