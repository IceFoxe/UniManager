class GradeDTO {
    constructor(id, student_id, group_id, value, date) {
        this.id = id;
        this.student_id = student_id;
        this.group_id = group_id;
        this.value = value;
        this.date = date;
    }
}

module.exports = GradeDTO;