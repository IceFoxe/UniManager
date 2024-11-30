const { models } = require('../config/db');
const { getIdParam } = require('../helpers');

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