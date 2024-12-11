// components/StudentDetails.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider
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

const StudentDetails: React.FC<StudentDetailsProps> = ({ studentId }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await studentApi.getStudentById(studentId);
        console.log(data);
        setStudent(data);
      } catch (err) {
        setError('Failed to load student details');
        console.error('Student loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [studentId]);

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

  if (!student) {
    return <Alert severity="warning">Student not found</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Student Information
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        <InfoField label="Student Code" value={student.studentCode} />
        <InfoField label="Full Name" value={student.fullName} />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <InfoField label="Faculty" value={student.facultyName} />
        <InfoField label="Program" value={student.programName} />
        <InfoField label="Academic Standing" value={student.academicStanding} />
        <InfoField label="Enrollment Status" value={student.status} />
      </Box>
    </Box>
  );
};

export default StudentDetails;