class Faculty {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.code = data.code;
        this._programs = data.programs || [];
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
    }

    get programs() {
        return this._programs;
    }

    set programs(programs) {
        this._programs = programs;
    }
}