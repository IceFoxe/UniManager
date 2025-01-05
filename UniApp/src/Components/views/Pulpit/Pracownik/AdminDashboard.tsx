import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import styles from './AdminDashboard.styles';

interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'professor' | 'Admin';
  studentInfo?: StudentInfo;
}

interface StudentInfo {
  studentNumber: string;
  program: Program | null;
  semester: number;
  status: 'active' | 'inactive';
}



interface Program {
  id?: number;
  name: string;
  code: string;
  facultyId: number;
  degree: 'Bachelor' | 'Master' | 'PhD';
  duration: number;
  description: string;
}


const AdminDashboard = () => {
  // Tab state
  const [currentTab, setCurrentTab] = useState(0);

  // Dialog states
  const [openDialogs, setOpenDialogs] = useState({
    user: false,
    faculty: false,
    program: false,
    course: false,
  });

  // Form states
  const [newUser, setNewUser] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'student',
    studentInfo: {
      studentNumber: '',
      program: null,
      semester: 1,
      status: 'active'
    }
  });



  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });



  const mockPrograms = [
    { id: 1, name: 'Computer Science', code: 'CS', facultyId: 1, degree: 'Bachelor' as const, duration: 3, description: 'CS program' }
  ];

  // Handler functions
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number)  => {
    setCurrentTab(newValue);
  };

  const handleOpenDialog = (dialog: keyof typeof openDialogs) => {
    setOpenDialogs({ ...openDialogs, [dialog]: true });
  };

  const handleCloseDialog = (dialog: keyof typeof openDialogs) => {
    setOpenDialogs({ ...openDialogs, [dialog]: false });
  };

  const handleSubmit = async (type: 'user' | 'faculty' | 'program' | 'course') => {
    try {
      // Add API calls here
      setSnackbar({
        open: true,
        message: `${type} created successfully`,
        severity: 'success'
      });
      handleCloseDialog(type);
    } catch {
      setSnackbar({
        open: true,
        message: `Error creating ${type}`,
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={styles.mainContainer}>
      <Tabs value={currentTab} onChange={handleTabChange} sx={styles.tabs}>
        <Tab icon={<PersonIcon />} label="Users" />
        <Tab icon={<BusinessIcon />} label="Faculties" />
        <Tab icon={<SchoolIcon />} label="Programs" />
        <Tab icon={<BookIcon />} label="Courses" />
      </Tabs>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(
            currentTab === 0 ? 'user' :
            currentTab === 1 ? 'faculty' :
            currentTab === 2 ? 'program' : 'course'
          )}
          sx={styles.quickActionButton}
        >
          Add New {currentTab === 0 ? 'User' :
                   currentTab === 1 ? 'Faculty' :
                   currentTab === 2 ? 'Program' : 'Course'}
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              {currentTab === 0 && (
                <>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </>
              )}
              {currentTab === 1 && (
                <>
                  <TableCell>Faculty Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Actions</TableCell>
                </>
              )}
              {/* Add other tab headers */}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Add table content based on currentTab */}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogs */}
      <Dialog
        open={openDialogs.user}
        onClose={() => handleCloseDialog('user')}
        fullWidth
        maxWidth="sm"
        sx={styles.dialog}
      >
        <DialogTitle sx={styles.dialogTitle}>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="First Name"
            value={newUser.firstName}
            onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
            sx={styles.inputField}
          />
          <TextField
            fullWidth
            label="Last Name"
            value={newUser.lastName}
            onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
            sx={styles.inputField}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            sx={styles.inputField}
          />
          <FormControl fullWidth sx={styles.inputField}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              label="Role"
              onChange={(e) => setNewUser({...newUser, role: e.target.value as User['role']})}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="professor">Professor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          {newUser.role === 'student' && (
            <>
              <TextField
                fullWidth
                label="Student Number"
                value={newUser.studentInfo?.studentNumber}
                onChange={(e) => setNewUser({
                  ...newUser,
                  studentInfo: {...newUser.studentInfo!, studentNumber: e.target.value}
                })}
                sx={styles.inputField}
              />
              <Autocomplete
                options={mockPrograms}
                getOptionLabel={(option) => option.name}
                value={newUser.studentInfo?.program}
                onChange={(_, value) => setNewUser({
                  ...newUser,
                  studentInfo: {...newUser.studentInfo!, program: value}
                })}
                renderInput={(params) => (
                  <TextField {...params} label="Program" sx={styles.inputField} />
                )}
              />
              {/* Add other student-specific fields */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog('user')}>
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit('user')}
            variant="contained"
            sx={styles.dialogButton}
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add similar dialogs for Faculty, Program, and Course */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;