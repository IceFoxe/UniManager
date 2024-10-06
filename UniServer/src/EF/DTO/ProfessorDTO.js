class ProfessorDTO {
  constructor(id, firstName, lastName, faculty, accountId) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.faculty = faculty;
    this.accountId = accountId;
  }
}

module.exports = ProfessorDTO;