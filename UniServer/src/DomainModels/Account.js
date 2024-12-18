class Account {
  constructor(data) {
    this.id = data.account_id;
    this.login = data.login;
    this.email = data.email;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.role = data.role;
    this.lastLogin = data.last_login ? new Date(data.last_login) : null;
    this.createdAt = data.created_at ? new Date(data.created_at) : null;

    this._student = null;
    this._employee = null;
    this._auditLogs = [];
  }

  get fullName() {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }

  // Role-based checks that can be used for authorization
  isStudent() {
    return this.role.toLowerCase() === 'student';
  }

  isProfessor() {
    return this.role.toLowerCase() === 'professor';
  }

  isAdmin() {
    return this.role.toLowerCase() === 'admin';
  }

  isEmployee() {
    return this.role.toLowerCase() === 'employee';
  }

  // Related entity getters and setters
  get student() {
    return this._student;
  }

  set student(student) {
    // Ensure the student belongs to this account
    if (student && student.accountId !== this.id) {
      throw new Error('Student account ID mismatch');
    }
    this._student = student;
  }

  get employee() {
    return this._employee;
  }

  set employee(employee) {
    if (employee && employee.accountId !== this.id) {
      throw new Error('Employee account ID mismatch');
    }
    this._employee = employee;
  }

  get auditLogs() {
    return [...this._auditLogs]; // Return a copy to prevent direct modification
  }

  addAuditLog(auditLog) {
    if (auditLog.accountId !== this.id) {
      throw new Error('Audit log account ID mismatch');
    }
    this._auditLogs.push(auditLog);
  }

  // Business logic methods
  hasRecentLogin(hoursThreshold = 24) {
    if (!this.lastLogin) return false;
    const hoursSinceLastLogin = (Date.now() - this.lastLogin.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastLogin <= hoursThreshold;
  }

  // Domain validation methods
  isEmailValid() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }
}

module.exports = Account;