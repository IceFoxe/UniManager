const { models } = require('../config/db');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
    try {
        const employees = await models.Employee.findAll();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getById(req, res) {
    try {
        const id = getIdParam(req);
        const employee = await models.Employee.findByPk(id);
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).send('404 - Not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function create(req, res) {
    try {
        if (req.body.employee_id) {
            res.status(400).send('Bad request: ID should not be provided, since it is determined automatically by the database.');
        } else {
            await models.Employee.create(req.body);
            res.status(201).end();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function update(req, res) {
    try {
        const id = getIdParam(req);
        if (req.body.employee_id === id) {
            await models.Employee.update(req.body, {
                where: { employee_id: id }
            });
            res.status(200).end();
        } else {
            res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.employee_id}).`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function remove(req, res) {
    try {
        const id = getIdParam(req);
        await models.Employee.destroy({
            where: { employee_id: id }
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