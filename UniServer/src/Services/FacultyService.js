class FacultyService {
    constructor(facultyRepository, logRepository) {
        this.facultyRepository = facultyRepository;
        this.logRepository = logRepository;
    }

    async getFacultyPrograms(id) {
        const faculty = await this.facultyRepository.findById(id);
        if (!faculty) return null;

        return {
            programs: faculty.programs?.map(program => ({
                id: program.id,
                name: program.name
            }))
        };
    };

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

    async createFaculty(data, userData) {
        const t = await this.facultyRepository.sequelize.transaction();
        try {
            const faculty = await this.facultyRepository.create(data, { transaction: t });

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'CREATE',
                table_name: 'faculty',
                record_id: faculty.id,
                old_values: '',
                new_values: JSON.stringify(data),
            }, { transaction: t });

            await t.commit();
            return faculty;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to create faculty: ${error.message}`);
        }
    }

    async updateFaculty(id, data, userData) {
        const t = await this.facultyRepository.sequelize.transaction();
        try {
            const oldFaculty = await this.facultyRepository.findById(id);
            if (!oldFaculty) {
                throw new Error('Faculty not found');
            }

            const updatedFaculty = await this.facultyRepository.update(id, data, { transaction: t });

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'UPDATE',
                table_name: 'faculty',
                record_id: id,
                old_values: JSON.stringify(oldFaculty),
                new_values: JSON.stringify(data),
            }, { transaction: t });

            await t.commit();
            return updatedFaculty;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to update faculty: ${error.message}`);
        }
    }

    async deleteFaculty(id, userData) {
        const t = await this.facultyRepository.sequelize.transaction();
        try {
            const faculty = await this.facultyRepository.findById(id);
            if (!faculty) {
                throw new Error('Faculty not found');
            }

            await this.facultyRepository.delete(id, { transaction: t });

            await this.logRepository.create({
                account_id: userData.userId,
                timestamp: new Date(),
                action: 'DELETE',
                table_name: 'faculty',
                record_id: id,
                old_values: JSON.stringify(faculty),
                new_values: '',
            }, { transaction: t });

            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw new Error(`Failed to delete faculty: ${error.message}`);
        }
    }
}

module.exports = FacultyService;