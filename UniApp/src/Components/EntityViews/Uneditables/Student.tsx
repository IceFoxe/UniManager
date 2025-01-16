import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Stack,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';
import { Student, Faculty, Program } from '../../../types/student';
import studentApi from '../../../services/studentApi';

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
      paper: '#1e1e1e',
    },
  },
} as const;

const DetailContainer = styled(Box)(({ theme }) => ({
  backgroundColor: darkTheme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  color: theme.palette.common.white,
}));

const DetailTitle = styled(Typography)(({ theme }) => ({
  color: darkTheme.palette.primary.light,
  fontWeight: 600,
  marginBottom: theme.spacing(3),
}));

const DetailGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const fieldStyles = {
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
    '& input, & .MuiSelect-select': {
      color: 'white',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'grey.500',
    '&.Mui-focused': {
      color: darkTheme.palette.primary.main,
    },
  },
  '& .MuiSelect-icon': {
    color: 'grey.500',
  },
} as const;

interface StudentDetailsProps {
  studentId: string;
}

type FormErrors = {
  [key: string]: string;
};

interface EditableStudent extends Omit<Student, 'id' | 'facultyName' | 'programName'> {
  facultyId: string ;
  programId: string ;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ studentId }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<EditableStudent | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoadingFaculties, setIsLoadingFaculties] = useState(false);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);

  const loadFaculties = async () => {
    try {
      setIsLoadingFaculties(true);
      const response = await studentApi.getFaculties();
      setFaculties(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to load faculties:', err);
      setError('Failed to load faculties');
      return [];
    } finally {
      setIsLoadingFaculties(false);
    }
  };

  const loadPrograms = async (facultyId: string) => {
    if (!facultyId) return;

    try {
      setIsLoadingPrograms(true);
      const response = await studentApi.getProgramsByFaculty(facultyId);
      setPrograms(response.programs);
      return response.programs;
    } catch (err) {
      console.error('Failed to load programs:', err);
      setError('Failed to load programs');
      return [];
    } finally {
      setIsLoadingPrograms(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [studentData, facultiesData] = await Promise.all([
          studentApi.getStudentById(studentId),
          loadFaculties(),
        ]);

        setStudent(studentData);

        const faculty = facultiesData.find((f: { name: any; }) => f.name === studentData.facultyName);
        if (!faculty) {
          throw new Error('Faculty not found');
        }

        const programsData = await loadPrograms(faculty.id);
        const program = programsData.find((p: { name: any; }) => p.name === studentData.programName);

        if (!program) {
          throw new Error('Program not found');
        }

        const { id, facultyName, programName, ...rest } = studentData;
        setEditData({
          ...rest,
          facultyId: faculty.id,
          programId: program.id,
        });
      } catch (err) {
        console.error('Failed to initialize:', err);
        setError('Failed to load student details');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [studentId]);

  const validateField = useCallback((name: string, value: any): string => {
    if (!value && name !== 'programId') return 'This field is required';

    switch (name) {
      case 'studentCode':
        return /^\d{6}$/.test(value) ? '' : 'Must be exactly 6 digits';
      case 'fullName':
        if (value.length < 2) return 'Minimum 2 characters';
        if (value.length > 100) return 'Maximum 100 characters';
        return '';
      default:
        return '';
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;

    setEditData(prev => {
      if (!prev) return null;

      if (name === 'facultyId') {
        loadPrograms(value);
        return { ...prev, [name]: value, programId: null };
      }

      return { ...prev, [name]: value };
    });

    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors(prev => error ? { ...prev, [name]: error } : { ...prev, [name]: undefined });
  };

  const handleSave = async () => {
    if (!editData) return;

    const newErrors: FormErrors = {};
    Object.entries(editData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const faculty = faculties.find(f => f.id === editData.facultyId);
      const program = programs.find(p => p.id === editData.programId);

      if (!faculty || !program) {
        throw new Error('Invalid faculty or program selected');
      }

      const { facultyId, programId, ...rest } = editData;
      const updateData = {
        ...rest,
        facultyName: faculty.name,
        programName: program.name,
      };

      const updatedStudent = await studentApi.updateStudent(studentId, updateData);
      setStudent(updatedStudent);
      setIsEditing(false);
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save student details');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!student) return;

    setIsEditing(false);
    const faculty = faculties.find(f => f.name === student.facultyName);
    const program = programs.find(p => p.name === student.programName);

    const { id, facultyName, programName, ...rest } = student;
    setEditData({
      ...rest,
      facultyId: faculty?.id || 'null',
      programId: program?.id || 'null',
    });

    setErrors({});
    setTouched({});
    setError(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!student || !editData) {
    return <Alert severity="warning">Student not found</Alert>;
  }

  return (
    <DetailContainer>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DetailTitle variant="h6">Student Details</DetailTitle>
          {!isEditing ? (
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
              sx={{
                bgcolor: darkTheme.palette.primary.main,
                '&:hover': {
                  bgcolor: darkTheme.palette.primary.dark,
                },
              }}
            >
              Edit
            </Button>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button
                onClick={handleCancel}
                disabled={saving}
                sx={{
                  color: 'grey.400',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                startIcon={saving && <CircularProgress size={20} />}
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
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </Stack>
          )}
        </Box>

        <DetailGrid>
          {isEditing ? (
            <>
              <TextField
                name="studentCode"
                label="Student Code"
                value={editData.studentCode}
                onChange={handleChange}
                error={touched.studentCode && Boolean(errors.studentCode)}
                helperText={touched.studentCode && errors.studentCode}
                disabled={saving}
                sx={fieldStyles}
              />
              <TextField
                name="fullName"
                label="Full Name"
                value={editData.fullName}
                onChange={handleChange}
                error={touched.fullName && Boolean(errors.fullName)}
                helperText={touched.fullName && errors.fullName}
                disabled={saving}
                sx={fieldStyles}
              />
              <FormControl
                error={touched.facultyId && Boolean(errors.facultyId)}
                disabled={saving || isLoadingFaculties}
                sx={fieldStyles}
              >
                <InputLabel>Faculty</InputLabel>
                <Select
                  name="facultyId"
                  value={editData.facultyId || ''}
                  onChange={handleChange}
                  label="Faculty"
                >
                  {faculties.map(faculty => (
                    <MenuItem key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.facultyId && errors.facultyId && (
                  <FormHelperText>{errors.facultyId}</FormHelperText>
                )}
              </FormControl>

              <FormControl
                error={touched.programId && Boolean(errors.programId)}
                disabled={saving || isLoadingPrograms || !editData.facultyId}
                sx={fieldStyles}
              >
                <InputLabel>Program</InputLabel>
                <Select
                  name="programId"
                  value={editData.programId || ''}
                  onChange={handleChange}
                  label="Program"
                >
                  {programs.map(program => (
                    <MenuItem key={program.id} value={program.id}>
                      {program.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.programId && errors.programId && (
                  <FormHelperText>{errors.programId}</FormHelperText>
                )}
              </FormControl>

              <TextField
                name="academicStanding"
                label="Academic Standing"
                value={editData.academicStanding}
                onChange={handleChange}
                error={touched.academicStanding && Boolean(errors.academicStanding)}
                helperText={touched.academicStanding && errors.academicStanding}
                disabled={saving}
                sx={fieldStyles}
              />
              <FormControl
                sx={fieldStyles}
                disabled={saving}
                error={touched.status && Boolean(errors.status)}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={editData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
                {touched.status && errors.status && (
                  <FormHelperText>{errors.status}</FormHelperText>
                )}
              </FormControl>
            </>
          ) : (
            Object.entries({
              'Student Code': student.studentCode,
              'Full Name': student.fullName,
              'Faculty': student.facultyName,
              'Program': student.programName,
              'Academic Standing': student.academicStanding,
              'Status': student.status,
            }).map(([label, value]) => (
              <Box key={label} sx={{ p: 2 }}>
                <Typography variant="caption" sx={{ color: 'grey.500' }}>
                  {label}
                </Typography>
                <Typography>{value}</Typography>
              </Box>
            ))
          )}
        </DetailGrid>
      </Stack>
    </DetailContainer>
  );
};

export default React.memo(StudentDetails);