const { models } = require('../config/db');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
    try {
        const grades = await models.Grade.findAll();
        res.status(200).json(grades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getById(req, res) {
    try {
        const id = getIdParam(req);
        const grade = await models.Grade.findByPk(id);
        if (grade) {
            res.status(200).json(grade);
        } else {
            res.status(404).send('404 - Not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function create(req, res) {
    try {
        if (req.body.id) {
            res.status(400).send('Bad request: ID should not be provided, since it is determined automatically by the database.');
        } else {
            await models.Grade.create(req.body);
            res.status(201).end();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function update(req, res) {
    try {
        const id = getIdParam(req);
        if (req.body.id === id) {
            await models.Grade.update(req.body, {
                where: { id: id }
            });
            res.status(200).end();
        } else {
            res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function remove(req, res) {
    try {
        const id = getIdParam(req);
        await models.Grade.destroy({
            where: { id: id }
        });
        res.status(200).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Additional utility routes

async function getByStudent(req, res) {
    try {
        const studentId = req.params.studentId;
        const grades = await models.Grade.findAll({
            where: { student_id: studentId },
            order: [['date', 'DESC']]
        });
        res.status(200).json(grades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getByGroup(req, res) {
    try {
        const groupId = req.params.groupId;
        const grades = await models.Grade.findAll({
            where: { group_id: groupId },
            order: [['date', 'DESC']]
        });
        res.status(200).json(grades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    getByStudent,
    getByGroup
};