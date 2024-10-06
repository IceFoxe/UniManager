const AccountDAO = require('../dao/AccountDAO');
const AccountMapper = require('../mappers/AccountMapper');
const bcrypt = require('bcrypt');

class AccountService {
  static async getAllAccounts() {
    const accounts = await AccountDAO.findAll();
    return accounts.map(AccountMapper.toDTO);
  }

  static async getAccountById(id) {
    const account = await AccountDAO.findById(id);
    return account ? AccountMapper.toDTO(account) : null;
  }

  static async createAccount(accountDTO, password) {
    const accountData = AccountMapper.toModel(accountDTO);
    accountData.password = password; // Password will be hashed by the model hook
    const createdAccount = await AccountDAO.create(accountData);
    return AccountMapper.toDTO(createdAccount);
  }

  static async updateAccount(id, accountDTO) {
    const accountData = AccountMapper.toModel(accountDTO);
    const updatedAccount = await AccountDAO.update(id, accountData);
    return updatedAccount ? AccountMapper.toDTO(updatedAccount) : null;
  }

  static async deleteAccount(id) {
    return await AccountDAO.delete(id);
  }

  static async authenticate(username, password) {
    const account = await AccountDAO.findByUsername(username);
    if (account && await account.validatePassword(password)) {
      return AccountMapper.toDTO(account);
    }
    return null;
  }

  static async changePassword(id, oldPassword, newPassword) {
    const account = await AccountDAO.findById(id);
    if (account && await account.validatePassword(oldPassword)) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await AccountDAO.update(id, { password: hashedPassword });
      return true;
    }
    return false;
  }
}

module.exports = AccountService;
