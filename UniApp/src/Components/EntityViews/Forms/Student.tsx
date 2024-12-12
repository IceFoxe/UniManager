import React, { useState, useEffect } from 'react';
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
import { Faculty, Program } from '../../../types/student';
import studentApi from '../../../services/studentApi';

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

const StudentForm: React.FC<Props> = ({ onSubmit, onClose, isLoading = false }) => {
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

  const validateField = (name: keyof StudentFormData, value: any): string => {
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
  };

  const handleFieldChange = (
    name: keyof StudentFormData,
    value: any,
  ) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'facultyId') {
        // Reset programId when faculty changes
        newData.programId = null;
      }
      return newData;
    });

    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => error ? { ...prev, [name]: error } : { ...prev, [name]: undefined });
  };

  const handleSelectChange = (event: SelectChangeEvent<number | string | null>) => {
    const { name, value } = event.target;
    const numericValue = value === '' ? null : Number(value);
    handleFieldChange(name as keyof StudentFormData, numericValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
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
      const submissionData = {
        ...formData,
        facultyId: formData.facultyId,
        programId: formData.programId,
        enrollmentDate: formData.enrollmentDate?.toDate() ?? null,
        expectedGraduationDate: formData.expectedGraduationDate?.toDate() ?? null,
      };
      await onSubmit(submissionData);
      onClose();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>Add New Student</Typography>
      <Stack spacing={3}>
        <Box display="grid" gap={2} gridTemplateColumns="repeat(2, 1fr)">
          <FormControl
            error={touched.facultyId && Boolean(errors.facultyId)}
            disabled={isLoading || isLoadingFaculties}
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
              <FormHelperText>{errors.facultyId}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            error={touched.programId && Boolean(errors.programId)}
            disabled={isLoading || isLoadingPrograms || !formData.facultyId}
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
              <FormHelperText>{errors.programId}</FormHelperText>
            )}
          </FormControl>

          <TextField
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={e => handleFieldChange('firstName', e.target.value)}
            error={touched.firstName && Boolean(errors.firstName)}
            helperText={touched.firstName && errors.firstName}
            disabled={isLoading}
          />

          <TextField
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={e => handleFieldChange('lastName', e.target.value)}
            error={touched.lastName && Boolean(errors.lastName)}
            helperText={touched.lastName && errors.lastName}
            disabled={isLoading}
          />

          <TextField
            name="studentNumber"
            label="Student Number"
            value={formData.studentNumber}
            onChange={e => handleFieldChange('studentNumber', e.target.value)}
            error={touched.studentNumber && Boolean(errors.studentNumber)}
            helperText={touched.studentNumber && errors.studentNumber}
            disabled={isLoading}
          />

          <TextField
            name="semester"
            label="Semester"
            type="number"
            value={formData.semester}
            onChange={e => handleFieldChange('semester', e.target.value)}
            error={touched.semester && Boolean(errors.semester)}
            helperText={touched.semester && errors.semester}
            disabled={isLoading}
          />

          <FormControl
            error={touched.status && Boolean(errors.status)}
            disabled={isLoading}
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
              <FormHelperText>{errors.status}</FormHelperText>
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
                helperText: touched.enrollmentDate && errors.enrollmentDate
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
                helperText: touched.expectedGraduationDate && errors.expectedGraduationDate
              }
            }}
          />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default React.memo(StudentForm);