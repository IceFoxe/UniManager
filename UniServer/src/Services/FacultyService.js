// services/facultyService.js
class FacultyService {
    constructor(facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    async getFaculties(queryParams) {
        const filters = {
            search: queryParams.search,
            sortBy: queryParams.sortBy,
            sortDir: queryParams.sortDir,
            page: parseInt(queryParams.page) || 1,
            limit: parseInt(queryParams.limit) || 10
        };

        const result = await this.facultyRepository.findAll(filters);

        return {
            data: result.data.map(faculty => ({
                id: faculty.id,
                name: faculty.name,
                code: faculty.code,
                createdAt: faculty.createdAt,
                updatedAt: faculty.updatedAt,
                programsCount: faculty.programs?.length || 0
            })),
            metadata: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            }
        };
    }

    async getFacultyById(id) {
        const faculty = await this.facultyRepository.findById(id);
        if (!faculty) return null;

        return {
            id: faculty.id,
            name: faculty.name,
            code: faculty.code,
            createdAt: faculty.createdAt,
            updatedAt: faculty.updatedAt,
            programs: faculty.programs?.map(program => ({
                id: program.id,
                name: program.name
            }))
        };
    }

    async createFaculty(data) {
        return this.facultyRepository.create(data);
    }

    async updateFaculty(id, data) {
        return this.facultyRepository.update(id, data);
    }

    async deleteFaculty(id) {
        return this.facultyRepository.delete(id);
    }
}

module.exports = FacultyService;