import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';

interface StudentData {
  firstName: string;
  lastName: string;
  login: string;
  email: string;
  password?: string;
  repeatPassword?: string;
}

interface FormErrors {
  password?: string;
  repeatPassword?: string;
}

interface AuthUser {
  entity_id: string;
  token: string;
}

type EditableFields = {
  [K in keyof StudentData]: boolean;
};

const EDITABLE_FIELDS: EditableFields = {
  firstName: false,
  lastName: false,
  login: false,
  email: true,
  password: true,
  repeatPassword: true
} as const;

interface PasswordFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ value, onChange, error, helperText }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      fullWidth
      size="small"
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              size="small"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ mt: 1 }}
    />
  );
};

const StudentProfilePanel: React.FC = () => {
  const theme = useTheme();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [formData, setFormData] = useState<StudentData | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchStudentData();
  }, []);

  useEffect(() => {
    if (isEditMode && formData) {
      validatePasswords(formData.password, formData.repeatPassword);
    }
  }, [formData?.password, formData?.repeatPassword]);

  const validatePasswords = (password?: string, repeatPassword?: string): boolean => {
    const newErrors: FormErrors = {};

    if (password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (password && repeatPassword && password !== repeatPassword) {
      newErrors.repeatPassword = 'Passwords do not match';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchStudentData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const userDataStr = localStorage.getItem('user');

      if (!authToken || !userDataStr) {
        throw new Error('No authentication data found');
      }

      const userData = JSON.parse(userDataStr) as AuthUser;
      const response = await fetch(`http://localhost:3001/api/students/${userData.entity_id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student data');
      }

      const result = await response.json();
      const mappedData: StudentData = {
        firstName: result.first_name,
        lastName: result.last_name,
        login: result.login,
        email: result.email
      };

      setStudentData(mappedData);
      setFormData(mappedData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof StudentData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!formData || !EDITABLE_FIELDS[field]) return;

    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = async () => {
    if (!formData) return;

    if (formData.password && !validatePasswords(formData.password, formData.repeatPassword)) {
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const userDataStr = localStorage.getItem('user');

      if (!authToken || !userDataStr) {
        throw new Error('No authentication data found');
      }

      const userData = JSON.parse(userDataStr) as AuthUser;
      const requestBody = {
        email: formData.email,
        ...(formData.password ? { password: formData.password } : {})
      };

      const response = await fetch(`http://localhost:3001/api/students/update/${userData.entity_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const { password, repeatPassword, ...dataWithoutPasswords } = formData;
      setStudentData(dataWithoutPasswords);
      setIsEditMode(false);
      setFormErrors({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const renderField = (label: string, field: keyof StudentData) => (
    <Box sx={{
      mb: 2,
      p: 2,
      border: 1,
      borderColor: theme.palette.divider,
      borderRadius: 1,
      '&:hover': {
        bgcolor: EDITABLE_FIELDS[field] && isEditMode
          ? theme.palette.action.hover
          : 'transparent'
      }
    }}>
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1,
          fontWeight: 500,
          color: theme.palette.text.secondary,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.5px'
        }}
      >
        {label}
      </Typography>
      {isEditMode && EDITABLE_FIELDS[field] ? (
        field.toLowerCase().includes('password') ? (
          <PasswordField
            value={formData?.[field] || ''}
            onChange={handleInputChange(field)}
            error={Boolean(formErrors[field])}
            helperText={formErrors[field]}
          />
        ) : (
          <TextField
            fullWidth
            size="small"
            type="text"
            value={formData?.[field] || ''}
            onChange={handleInputChange(field)}
            sx={{ mt: 1 }}
          />
        )
      ) : (
        <Typography
          variant="body1"
          sx={{
            color: !EDITABLE_FIELDS[field] && isEditMode
              ? theme.palette.text.secondary
              : theme.palette.text.primary
          }}
        >
          {field.toLowerCase().includes('password') ? '••••••••' : (studentData?.[field] || '-')}
        </Typography>
      )}
    </Box>
  );

  if (loading) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  if (!studentData || !formData) {
    return <Alert severity="error">No student data available</Alert>;
  }

  return (
    <Paper elevation={0} sx={{
      p: 3,
      bgcolor: theme.palette.background.paper,
      borderRadius: 2,
      maxWidth: '800px',
      mx: 'auto'
    }}>
     <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
  <Typography variant="h5" sx={{ fontWeight: 500 }}>Informacje o Koncie</Typography>
  <Stack direction="row" spacing={2}>
    {isEditMode ? (
      <>
        <Button
          variant="outlined"
          onClick={() => {
            setIsEditMode(false);
            setFormData(studentData);
            setFormErrors({});
          }}
          sx={{ textTransform: 'none', px: 3, py: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ textTransform: 'none', px: 3, py: 1 }}
        >
          Save Changes
        </Button>
      </>
    ) : (
      <Button
        variant="contained"
        onClick={() => setIsEditMode(true)}
        sx={{ textTransform: 'none', px: 3, py: 1 }}
      >
        Edit Profile
      </Button>
    )}
  </Stack>
</Stack>

      <Divider sx={{ mb: 3 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, px: 1 }}>
        <Box sx={{ flex: '1 1 45%', minWidth: '280px' }}>
          {renderField('First Name', 'firstName')}
          {renderField('Login', 'login')}
          {isEditMode ? (
            <>
              {renderField('Password', 'password')}
              {renderField('Repeat Password', 'repeatPassword')}
            </>
          ) : null}
        </Box>
        <Box sx={{ flex: '1 1 45%', minWidth: '280px' }}>
          {renderField('Last Name', 'lastName')}
          {renderField('Email', 'email')}
        </Box>
      </Box>
    </Paper>
  );
};

export default StudentProfilePanel;