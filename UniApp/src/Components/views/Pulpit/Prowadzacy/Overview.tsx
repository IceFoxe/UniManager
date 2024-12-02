import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import {
  Grade as GradeIcon,
} from '@mui/icons-material';

// Use the same theme as login component
const darkTheme = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#5d2365',
      dark: '#a352b1',
      light: '#81298F',
    },
    background: {
      default: '#151515',
    }
  },
};

interface Student {
  id: number;
  name: string;
  index: string;
}

interface Course {
  id: number;
  name: string;
  code: string;
}

const ProfessorDashboard = () => {
  const [openGradeDialog, setOpenGradeDialog] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);

  const mockStudents = [
    { id: 1, name: 'John Doe', index: '123456' },
    { id: 2, name: 'Jane Smith', index: '123457' },
  ];

  const mockCourses = [
    { id: 1, name: 'Advanced Mathematics', code: 'MATH301' },
    { id: 2, name: 'Physics II', code: 'PHYS202' },
  ];

  const handleGradeSubmit = () => {
    setOpenGradeDialog(false);
  };

  // Common styles for form inputs
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: darkTheme.palette.primary.light,
      },
      '&.Mui-focused fieldset': {
        borderColor: darkTheme.palette.primary.main,
      },
      '& input': {
        color: 'white',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'grey.500',
      '&.Mui-focused': {
        color: darkTheme.palette.primary.main,
      },
    },
  };

  return (
    <Box sx={{
      padding: 3,
      bgcolor: darkTheme.palette.background.default,
      minHeight: '100vh'
    }}>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
      }}>
        {/* Add Grades Card */}
        <Card sx={{
          width: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(33.333% - 16px)' },
          bgcolor: 'rgba(26, 26, 26, 0.6)',
          border: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
              <GradeIcon sx={{ color: darkTheme.palette.primary.main }} />
              Add Grades
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'grey.400' }}>
              Quickly add or modify student grades
            </Typography>
            <Autocomplete
              options={mockStudents}
              getOptionLabel={(option) => `${option.name} (${option.index})`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Student"
                  size="small"
                  sx={inputStyles}
                />
              )}
              sx={{ mb: 2 }}
              onChange={(_, value) => setSelectedStudent(value)}
            />
            <Autocomplete
              options={mockCourses}
              getOptionLabel={(option) => `${option.name} (${option.code})`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Course"
                  size="small"
                  sx={inputStyles}
                />
              )}
              onChange={(_, value) => setSelectedCourse(value)}
            />
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              onClick={() => setOpenGradeDialog(true)}
              disabled={!selectedStudent || !selectedCourse}
              sx={{
                bgcolor: darkTheme.palette.primary.main,
                '&:hover': {
                  bgcolor: darkTheme.palette.primary.dark,
                },
                '&:disabled': {
                  bgcolor: 'rgba(93, 35, 101, 0.5)',
                },
              }}
            >
              Add Grade
            </Button>
          </CardActions>
        </Card>

        {/* Additional cards with similar styling */}
        {/* ... other cards with updated styles ... */}

      </Box>

      <Dialog
        open={openGradeDialog}
        onClose={() => setOpenGradeDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: darkTheme.palette.background.default,
            color: 'white',
          }
        }}
      >
        <DialogTitle>Add Grade</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'grey.300' }}>
            Student: {selectedStudent?.name}
          </Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'grey.300' }}>
            Course: {selectedCourse?.name}
          </Typography>
          <TextField
            select
            fullWidth
            label="Grade"
            sx={{ mt: 2, ...inputStyles }}
          >
            <MenuItem value="5.0">5.0</MenuItem>
            <MenuItem value="4.5">4.5</MenuItem>
            <MenuItem value="4.0">4.0</MenuItem>
            <MenuItem value="3.5">3.5</MenuItem>
            <MenuItem value="3.0">3.0</MenuItem>
            <MenuItem value="2.0">2.0</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Comments"
            multiline
            rows={4}
            sx={{ mt: 2, ...inputStyles }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenGradeDialog(false)}
            sx={{ color: 'grey.400' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGradeSubmit}
            variant="contained"
            sx={{
              bgcolor: darkTheme.palette.primary.main,
              '&:hover': {
                bgcolor: darkTheme.palette.primary.dark,
              },
            }}
          >
            Submit Grade
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfessorDashboard;