class Program {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.code = data.code;
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