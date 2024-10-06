const Account = require('../models/Account');

class AccountDAO {
  static async findAll() {
    return await Account.findAll();
  }

  static async findById(id) {
    return await Account.findByPk(id);
  }

  static async findByUsername(username) {
    return await Account.findOne({ where: { username } });
  }

  static async create(accountData) {
    return await Account.create(accountData);
  }

  static async update(id, accountData) {
    const account = await Account.findByPk(id);
    if (account) {
      return await account.update(accountData);
    }
    return null;
  }

  static async delete(id) {
    const account = await Account.findByPk(id);
    if (account) {
      await account.destroy();
      return true;
    }
    return false;
  }
}

module.exports = AccountDAO;