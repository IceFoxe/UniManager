class Grade {
    constructor(data) {
        this.id = data.id;
        this.value = data.value;
        this.date = data.date;
        this._student = null;
        this._group = null;
    }

    get student() {
        return this._student;
    }

    set student(student) {
        this._student = student;
    }

    get group() {
        return this._group;
    }

    set group(group) {
        this._group = group;
    }

    isPassing() {
        return this.value >= 3.0;
    }

    getDescription() {
        if (this.value >= 5.0) return 'Excellent';
        if (this.value >= 4.5) return 'Very Good';
        if (this.value >= 4.0) return 'Good';
        if (this.value >= 3.5) return 'Satisfactory';
        if (this.value >= 3.0) return 'Sufficient';
        return 'Insufficient';
    }
}

module.exports = Grade;