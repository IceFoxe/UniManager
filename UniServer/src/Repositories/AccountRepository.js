const Account = require('../DomainModels/Account');
const Student = require('../DomainModels/Student');
const Employee = require('../DomainModels/Employee');
const AuditLog = require('../DomainModels/AuditLog');
const bcrypt = require("bcrypt");

class AccountRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.Account = sequelize.models.Account;
  }

  toDomainModel(dbModel) {
    const plainData = dbModel.get({ plain: true });
    const account = new Account(plainData);

    if (plainData.Student) {
      account.student = new Student(plainData.Student);
    }
    if (plainData.Employee) {
      account.employee = new Employee(plainData.Employee);
    }

    if (plainData.AuditLogs) {
      plainData.AuditLogs.forEach(logData => {
        account.addAuditLog(new AuditLog(logData));
      });
    }

    return account;
  }

  async findById(id, includeRelations = true) {
    const queryOptions = {
      where: { account_id: id }
    };

    if (includeRelations) {
      queryOptions.include = [
        { model: this.sequelize.models.Student },
        { model: this.sequelize.models.Employee },
        { model: this.sequelize.models.AuditLog }
      ];
    }

    const account = await this.sequelize.models.Account.findOne(queryOptions);
    return account ? this.toDomainModel(account) : null;
  }

  async findByEmail(email) {
    const account = await this.sequelize.models.Account.findOne({
      where: { email }
    });
    return account ? this.toDomainModel(account) : null;
  }

  async search({ role, email, name, page = 1, limit = 10 }) {
    const where = {};

    if (role) {
      where.role = role;
    }

    if (email) {
      where.email = { [this.sequelize.Op.iLike]: `%${email}%` };
    }

    if (name) {
      where[this.sequelize.Op.or] = [
        { first_name: { [this.sequelize.Op.iLike]: `%${name}%` } },
        { last_name: { [this.sequelize.Op.iLike]: `%${name}%` } }
      ];
    }

    const { rows, count } = await this.sequelize.models.Account.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']]
    });

    return {
      data: rows.map(account => this.toDomainModel(account)),
      total: count,
      page,
      limit
    };
  }
  async create(accountData, options ={}) {
        try {
            const account = await this.Account.create({
                login: accountData.login,
                email: `${accountData.student_number}@gmail.com`,
                password_hash: await bcrypt.hash(accountData.student_number, 10),
                first_name: accountData.first_name,
                last_name: accountData.last_name,
                role: accountData.role,
                created_at: new Date()
            }, { transaction: options.transaction });
             return this.toDomainModel(account);
        } catch (error){
          throw new error;
        }

  }
}

module.exports = AccountRepository;