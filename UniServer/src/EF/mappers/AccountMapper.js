const AccountDTO = require('../dto/AccountDTO');

class AccountMapper {
  static toDTO(account) {
    return new AccountDTO(
      account.id,
      account.username,
      account.email,
      account.role
    );
  }

  static toModel(dto) {
    return {
      id: dto.id,
      username: dto.username,
      email: dto.email,
      role: dto.role,
      // Note: password should be handled separately for security
    };
  }
}

module.exports = AccountMapper;