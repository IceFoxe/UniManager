import React, { useState, useEffect, useCallback } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Stack,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Faculty, Program } from '../../../types/student';
import studentApi from '../../../services/studentApi';

// Theme configuration
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

// Styled components
const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: darkTheme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  color: theme.palette.common.white,
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  color: darkTheme.palette.primary.light,
  fontWeight: 600,
  marginBottom: theme.spacing(3),
}));

const FormGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

// Field styling configuration
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

// Types
interface StudentFormData {
  firstName: string;
  lastName: string;
  studentNumber: string;
  facultyId: string | null;
  programId: string | null;
  semester: number;
  status: 'ACTIVE' | 'SUSPENDED';
  enrollmentDate: Dayjs | null;
  expectedGraduationDate: Dayjs | null;
}

interface Props {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    facultyId: string;
    expectedGraduationDate: Date | null;
    studentNumber: string;
    enrollmentDate: Date | null;
    semester: number;
    programId: string;
    status: "ACTIVE" | "SUSPENDED"
  }) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

type FormErrors = Partial<Record<keyof StudentFormData, string>>;
type FormTouched = Partial<Record<keyof StudentFormData, boolean>>;

const INITIAL_FORM_STATE: StudentFormData = {
  firstName: '',
  lastName: '',
  studentNumber: '',
  facultyId: '',
  programId: '',
  semester: 1,
  status: 'ACTIVE',
  enrollmentDate: null,
  expectedGraduationDate: null,
};

const StudentForm = ({ onSubmit, onClose, isLoading = false }: Props) => {
  const [formData, setFormData] = useState<StudentFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoadingFaculties, setIsLoadingFaculties] = useState(false);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);

  useEffect(() => {
    const loadFaculties = async () => {
      try {
        setIsLoadingFaculties(true);
        const data = await studentApi.getFaculties();
        setFaculties(data.data);
      } catch (error) {
        console.error('Failed to load faculties:', error);
        setErrors(prev => ({ ...prev, facultyId: 'Failed to load faculties' }));
      } finally {
        setIsLoadingFaculties(false);
      }
    };

    loadFaculties();
  }, []);

  useEffect(() => {
    const loadPrograms = async () => {
      if (!formData.facultyId) {
        setPrograms([]);
        return;
      }

      try {
        setIsLoadingPrograms(true);
        const data = await studentApi.getProgramsByFaculty(formData.facultyId);
        setPrograms(data.programs);
      } catch (error) {
        console.error('Failed to load programs:', error);
        setErrors(prev => ({ ...prev, programId: 'Failed to load programs' }));
      } finally {
        setIsLoadingPrograms(false);
      }
    };

    loadPrograms();
  }, [formData.facultyId]);

  const validateField = useCallback((name: keyof StudentFormData, value: any): string => {
    if (!value && name !== 'semester') return 'This field is required';

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (value.length < 2) return 'Minimum 2 characters';
        if (value.length > 50) return 'Maximum 50 characters';
        return '';

      case 'studentNumber':
        if (!/^\d{6}$/.test(value)) return 'Must be exactly 6 digits';
        return '';

      case 'semester':
        const semesterNum = Number(value);
        if (!semesterNum) return 'This field is required';
        if (semesterNum < 1) return 'Minimum is 1';
        if (semesterNum > 12) return 'Maximum is 12';
        return '';

      default:
        return '';
    }
  }, []);

  const handleFieldChange = useCallback((
      name: keyof StudentFormData,
      value: any,
  ) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'facultyId') {
        newData.programId = null;
      }
      return newData;
    });

    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => error ? { ...prev, [name]: error } : { ...prev, [name]: undefined });
  }, [validateField]);

  const handleSelectChange = useCallback((event: SelectChangeEvent<number | string | null>) => {
    const { name, value } = event.target;
    const numericValue = value === '' ? null : Number(value);
    handleFieldChange(name as keyof StudentFormData, numericValue);
  }, [handleFieldChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const hasErrors = Object.keys(formData).some(key => {
      const fieldName = key as keyof StudentFormData;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        setErrors(prev => ({ ...prev, [fieldName]: error }));
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        return true;
      }
      return false;
    });

    if (hasErrors) return;

    if (!formData.facultyId || !formData.programId) return;

    try {
      await onSubmit({
        ...formData,
        facultyId: formData.facultyId,
        programId: formData.programId,
        enrollmentDate: formData.enrollmentDate?.toDate() ?? null,
        expectedGraduationDate: formData.expectedGraduationDate?.toDate() ?? null,
      });
      onClose();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
      <FormContainer onSubmit={handleSubmit}>
        <FormTitle variant="h6">Add New Student</FormTitle>

        <Stack spacing={3}>
          <FormGrid>
            <FormControl
                error={touched.facultyId && Boolean(errors.facultyId)}
                disabled={isLoading || isLoadingFaculties}
                sx={fieldStyles}
            >
              <InputLabel>Faculty</InputLabel>
              <Select
                  name="facultyId"
                  value={formData.facultyId ?? ''}
                  onChange={handleSelectChange}
                  label="Faculty"
              >
                {faculties.map(faculty => (
                    <MenuItem key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </MenuItem>
                ))}
              </Select>
              {touched.facultyId && errors.facultyId && (
                  <FormHelperText error>{errors.facultyId}</FormHelperText>
              )}
            </FormControl>

            <FormControl
                error={touched.programId && Boolean(errors.programId)}
                disabled={isLoading || isLoadingPrograms || !formData.facultyId}
                sx={fieldStyles}
            >
              <InputLabel>Program</InputLabel>
              <Select
                  name="programId"
                  value={formData.programId ?? ''}
                  onChange={handleSelectChange}
                  label="Program"
              >
                {programs.map(program => (
                    <MenuItem key={program.id} value={program.id}>
                      {program.name}
                    </MenuItem>
                ))}
              </Select>
              {touched.programId && errors.programId && (
                  <FormHelperText error>{errors.programId}</FormHelperText>
              )}
            </FormControl>

            {[
              { name: 'firstName', label: 'First Name' },
              { name: 'lastName', label: 'Last Name' },
              { name: 'studentNumber', label: 'Student Number' },
              { name: 'semester', label: 'Semester', type: 'number' },
            ].map((field) => (
                <TextField
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    type={field.type || 'text'}
                    value={formData[field.name as keyof StudentFormData]}
                    onChange={e => handleFieldChange(field.name as keyof StudentFormData, e.target.value)}
                    error={touched[field.name as keyof FormTouched] && Boolean(errors[field.name as keyof FormErrors])}
                    helperText={touched[field.name as keyof FormTouched] && errors[field.name as keyof FormErrors]}
                    disabled={isLoading}
                    sx={fieldStyles}
                />
            ))}

            <FormControl
                error={touched.status && Boolean(errors.status)}
                disabled={isLoading}
                sx={fieldStyles}
            >
              <InputLabel>Status</InputLabel>
              <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Status"
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
              </Select>
              {touched.status && errors.status && (
                  <FormHelperText error>{errors.status}</FormHelperText>
              )}
            </FormControl>

            <DatePicker
                label="Enrollment Date"
                value={formData.enrollmentDate}
                onChange={(date) => handleFieldChange('enrollmentDate', date)}
                disabled={isLoading}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: touched.enrollmentDate && Boolean(errors.enrollmentDate),
                    helperText: touched.enrollmentDate && errors.enrollmentDate,
                    sx: fieldStyles
                  }
                }}
            />

            <DatePicker
                label="Expected Graduation"
                value={formData.expectedGraduationDate}
                onChange={(date) => handleFieldChange('expectedGraduationDate', date)}
                disabled={isLoading}
                minDate={formData.enrollmentDate ?? undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: touched.expectedGraduationDate && Boolean(errors.expectedGraduationDate),
                    helperText: touched.expectedGraduationDate && errors.expectedGraduationDate,
                    sx: fieldStyles
                  }
                }}
            />
          </FormGrid>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
                onClick={onClose}
                disabled={isLoading}
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
                type="submit"
                variant="contained"
                disabled={isLoading}
                startIcon={isLoading && <CircularProgress size={20} />}
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
              Save
            </Button>
          </Stack>
        </Stack>
      </FormContainer>
  );
};

export default React.memo(StudentForm);