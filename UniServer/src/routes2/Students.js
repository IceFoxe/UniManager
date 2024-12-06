const { models } = require('../Config/DataBaseConfig');
const { getIdParam } = require('../helpers');

async function searchStudents(req, res) {
    try {
        const {
            facultyId,
            search,
            programId,
            year,
            page = 1,
            limit = 10
        } = req.query;

        const queryOptions = {
            include: [{
                model: models.Program,
                required: true,
                where: {
                    faculty_id: facultyId
                },
                include: [{
                    model: models.Faculty,
                    required: true
                }]
            }],
            where: {},
            order: [['student_code', 'ASC']],
            limit: parseInt(limit),
            offset: (page - 1) * parseInt(limit)
        };

        if (search) {
            queryOptions.where = {
                [Op.or]: [
                    { student_code: { [Op.like]: `%${search}%` } },
                    { first_name: { [Op.like]: `%${search}%` } },
                    { last_name: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        // Add program filter if provided
        if (programId) {
            queryOptions.include[0].where.program_id = programId;
        }

        // Add year filter if provided
        if (year) {
            queryOptions.where.year = year;
        }

        const students = await models.Student.findAndCountAll(queryOptions);

        res.status(200).json({
            data: students.rows,
            metadata: {
                total: students.count,
                page: parseInt(page),
                totalPages: Math.ceil(students.count / limit),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// If you need more specific queries, you could add endpoints like:
async function getStudentsByFaculty(req, res) {
    try {
        const { facultyId } = req.params;
        const students = await models.Student.findAll({
            include: [{
                model: models.Program,
                required: true,
                where: {
                    faculty_id: facultyId
                },
                attributes: ['program_name', 'program_code']  // Select specific fields
            }],
            attributes: [
                'student_id',
                'student_code',
                'first_name',
                'last_name',
                'year'
            ]
        });

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    searchStudents,
    getStudentsByFaculty
};
async function getAll(req, res) {
    try {
        console.log(`Received a ${req.method} request to ${req.url} XD`);
        const students = await models.Student.findAll();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getById(req, res) {
    try {
        const id = getIdParam(req);
        const student = await models.Student.findByPk(id);
        if (student) {
            res.status(200).json(student);
        } else {
            res.status(404).send('404 - Not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function create(req, res) {
    try {
        if (req.body.student_id) {
            res.status(400).send('Bad request: ID should not be provided, since it is determined automatically by the database.');
        } else {
            await models.Student.create(req.body);
            res.status(201).end();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function update(req, res) {
    try {
        const id = getIdParam(req);
        if (req.body.student_id === id) {
            await models.Student.update(req.body, {
                where: { student_id: id }
            });
            res.status(200).end();
        } else {
            res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.student_id}).`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function remove(req, res) {
    try {
        const id = getIdParam(req);
        await models.Student.destroy({
            where: { student_id: id }
        });
        res.status(200).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};