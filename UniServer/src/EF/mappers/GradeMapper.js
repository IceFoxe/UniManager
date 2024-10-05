const GradeDTO = require('../dto/GradeDTO');

class GradeMapper {
    static toDTO(grade) {
        return new GradeDTO(
            grade.id,
            grade.student_id,
            grade.group_id,
            grade.value,
            grade.date
        );
    }

    static toModel(dto) {
        return {
            id: dto.id,
            student_id: dto.student_id,
            group_id: dto.group_id,
            value: dto.value,
            date: dto.date,
        };
    }
}

module.exports = GradeMapper;