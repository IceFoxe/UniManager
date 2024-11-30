const { models } = require('../config/db');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
    try {
        const accounts = await models.Account.findAll({
            attributes: { exclude: ['password_hash', 'ssn_hash'] }
        });
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getById(req, res) {
    try {
        const id = getIdParam(req);
        const account = await models.Account.findByPk(id, {
            attributes: { exclude: ['password_hash', 'ssn_hash'] }
        });
        if (account) {
            res.status(200).json(account);
        } else {
            res.status(404).send('404 - Not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function create(req, res) {
    try {
        if (req.body.account_id) {
            res.status(400).send('Bad request: ID should not be provided, since it is determined automatically by the database.');
        } else {
            await models.Account.create(req.body);
            res.status(201).end();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function update(req, res) {
    try {
        const id = getIdParam(req);
        if (req.body.account_id === id) {
            await models.Account.update(req.body, {
                where: { account_id: id }
            });
            res.status(200).end();
        } else {
            res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.account_id}).`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function remove(req, res) {
    try {
        const id = getIdParam(req);
        await models.Account.destroy({
            where: { account_id: id }
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