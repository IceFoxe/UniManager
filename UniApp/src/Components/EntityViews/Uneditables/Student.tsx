import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Button,
  TextField,
  Stack
} from '@mui/material';
import { Student } from '../../../types/student';
import studentApi from '../../../services/studentApi';

interface StudentDetailsProps {
  studentId: string;
}

interface InfoFieldProps {
  label: string;
  value?: string;
}

interface EditFieldProps {
  label: string;
  name: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => (
  <Box sx={{ flex: '1 1 300px', minWidth: 0, p: 1 }}>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" noWrap>
      {value || '-'}
    </Typography>
  </Box>
);

const EditField: React.FC<EditFieldProps> = ({ label, name, value, onChange, disabled }) => (
  <Box sx={{ flex: '1 1 300px', minWidth: 0, p: 1 }}>
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      size="small"
      variant="outlined"
    />
  </Box>
);

const StudentDetails: React.FC<StudentDetailsProps> = ({ studentId }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<Student | null>(null);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await studentApi.getStudentById(studentId);
        setStudent(data);
        setEditData(data); // Initialize edit data with current student data
      } catch (err) {
        setError('Failed to load student details');
        console.error('Student loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [studentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!editData) return;

    try {
      setSaving(true);
      setError(null);
      const updatedStudent = await studentApi.updateStudent(studentId, editData);
      setStudent(updatedStudent);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save student details');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(student); // Reset edit data to current student data
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Student Information
        </Typography>
        {!isEditing ? (
          <Button variant="contained" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Stack>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        {isEditing ? (
          <>
            <EditField
              label="Student Code"
              name="studentCode"
              value={editData.studentCode}
              onChange={handleChange}
              disabled={saving}
            />
            <EditField
              label="Full Name"
              name="fullName"
              value={editData.fullName}
              onChange={handleChange}
              disabled={saving}
            />
          </>
        ) : (
          <>
            <InfoField label="Student Code" value={student.studentCode} />
            <InfoField label="Full Name" value={student.fullName} />
          </>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {isEditing ? (
          <>
            <EditField
              label="Faculty"
              name="facultyName"
              value={editData.facultyName}
              onChange={handleChange}
              disabled={saving}
            />
            <EditField
              label="Program"
              name="programName"
              value={editData.programName}
              onChange={handleChange}
              disabled={saving}
            />
            <EditField
              label="Academic Standing"
              name="academicStanding"
              value={editData.academicStanding}
              onChange={handleChange}
              disabled={saving}
            />
            <EditField
              label="Enrollment Status"
              name="status"
              value={editData.status}
              onChange={handleChange}
              disabled={saving}
            />
          </>
        ) : (
          <>
            <InfoField label="Faculty" value={student.facultyName} />
            <InfoField label="Program" value={student.programName} />
            <InfoField label="Academic Standing" value={student.academicStanding} />
            <InfoField label="Enrollment Status" value={student.status} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default StudentDetails;