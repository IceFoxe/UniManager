class EmployeeController {
    constructor(employeeService) {
        this.employeeService = employeeService;
    }

    async getAllEmployees(req, res) {
        try {
            const result = await this.employeeService.getAllEmployees(req.query);
            res.json(result);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
            res.status(500).json({
                error: 'Failed to fetch all employees',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async searchEmployees(req, res) {
        try {
            const result = await this.employeeService.searchEmployees(req.query);
            res.json(result);
        } catch (error) {
            console.error('Failed to search employees:', error);
            res.status(500).json({
                error: 'Failed to fetch employees',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async createEmployee(req, res) {
        try {
            const employee = await this.employeeService.createEmployee(req.body, req.user);
            res.status(201).json(employee);
        } catch (error) {
            console.error('Failed to create employee:', error);
            res.status(400).json({error: error.message});
        }
    }

    async getEmployeeById(req, res) {
        try {
            const employee = await this.employeeService.getEmployeeById(req.params.id);
            if (!employee) {
                return res.status(404).json({error: 'Employee not found'});
            }
            res.json(employee);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async deleteEmployeeById(req, res) {
        try {
            await this.employeeService.deleteEmployeeById(req.params.id, req.user);
            res.status(200).json({message: 'Employee deleted successfully'});
        } catch (error) {
            console.error('Failed to delete employee:', error);
            res.status(error.message.includes('not found') ? 404 : 500).json({
                error: 'Failed to delete employee',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async updateEmployeeById(req, res) {
        try {
            const updatedEmployee = await this.employeeService.updateEmployeeById(
                req.params.id,
                req.body,
                req.user
            );
            res.json(updatedEmployee);
        } catch (error) {
            console.error('Failed to update employee:', error);
            const status = error.message.includes('not found') ? 404 : 500;
            res.status(status).json({
                error: 'Failed to update employee',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = EmployeeController;