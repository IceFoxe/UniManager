const { models } = require('../Config/DataBaseConfig');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
    try {
        const faculties = await models.Faculty.findAll();
        res.status(200).json(faculties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getById(req, res) {
    try {
        const id = getIdParam(req);
        const faculty = await models.Faculty.findByPk(id);
        if (faculty) {
            res.status(200).json(faculty);
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
            await models.Faculty.create(req.body);
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
            await models.Faculty.update(req.body, {
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
        await models.Faculty.destroy({
            where: { id: id }
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