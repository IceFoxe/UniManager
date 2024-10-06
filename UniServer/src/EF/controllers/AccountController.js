const AccountService = require('../services/AccountService');
const AccountDTO = require('../dto/AccountDTO');

class AccountController {
  static async getAllAccounts(req, res) {
    try {
      const accounts = await AccountService.getAllAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAccountById(req, res) {
    try {
      const account = await AccountService.getAccountById(req.params.id);
      if (account) {
        res.json(account);
      } else {
        res.status(404).json({ message: 'Account not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createAccount(req, res) {
    try {
      const accountDTO = new AccountDTO(
        null,
        req.body.username,
        req.body.email,
        req.body.role
      );
      const createdAccount = await AccountService.createAccount(accountDTO, req.body.password);
      res.status(201).json(createdAccount);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateAccount(req, res) {
    try {
      const accountDTO = new AccountDTO(
        req.params.id,
        req.body.username,
        req.body.email,
        req.body.role
      );
      const updatedAccount = await AccountService.updateAccount(req.params.id, accountDTO);
      if (updatedAccount) {
        res.json(updatedAccount);
      } else {
        res.status(404).json({ message: 'Account not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteAccount(req, res) {
    try {
      const result = await AccountService.deleteAccount(req.params.id);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Account not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const account = await AccountService.authenticate(username, password);
      if (account) {
        // Here you would typically create a JWT or session
        res.json({ message: 'Login successful', account });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await AccountService.changePassword(req.params.id, oldPassword, newPassword);
      if (result) {
        res.json({ message: 'Password changed successfully' });
      } else {
        res.status(400).json({ message: 'Failed to change password' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AccountController;