class AccountService {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async searchAccounts(queryParams) {

    const searchParams = {
      role: queryParams.role?.toLowerCase(),
      email: queryParams.email,
      name: queryParams.name,
      page: parseInt(queryParams.page) || 1,
      limit: parseInt(queryParams.limit) || 10
    };

    const result = await this.accountRepository.search(searchParams);

    return {
      data: result.data.map(account => ({
        id: account.id,
        login: account.login,
        email: account.email,
        fullName: account.fullName,
        role: account.role,
        lastLogin: account.lastLogin,
        studentInfo: account.student ? {
          studentCode: account.student.studentCode,
          program: account.student.program?.name
        } : null,
        employeeInfo: account.employee ? {
          employeeCode: account.employee.employeeCode,
          department: account.employee.department
        } : null
      })),
      metadata: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit)
      }
    };
  }

  async getAccountDetails(id) {
    const account = await this.accountRepository.findById(id, true);
    if (!account) {
      throw new Error('Account not found');
    }

    return {
      id: account.id,
      login: account.login,
      email: account.email,
      fullName: account.fullName,
      role: account.role,
      lastLogin: account.lastLogin,
      createdAt: account.createdAt,
      recentActivity: account.auditLogs
        .slice(0, 5)
        .map(log => ({
          action: log.action,
          timestamp: log.timestamp
        }))
    };
  }
}