class Program {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.code = data.code;
    this.description = data.description;
    this.degreeLevel = data.degreeLevel;
    this.duration = data.duration;
    this.isActive = data.isActive;
    this._faculty = null;
  }

  get faculty() {
    return this._faculty;
  }

  set faculty(faculty) {
    this._faculty = faculty;
  }
}

module.exports = Program;