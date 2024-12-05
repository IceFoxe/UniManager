// components/StudentList.tsx
import React, { useState, useCallback } from 'react';
import { Student, Faculty, SearchParams, SearchMetadata } from '../../types/student';
import studentApi from '../../services/studentApi';
import {
  Box,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  SelectChangeEvent,
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { debounce } from 'lodash';
import StudentDetails from '../EntityViews/Uneditables/Student';

const INITIAL_SEARCH_PARAMS: SearchParams = {
  name: '',
  facultyId: '',
  studentCode: '',
  page: 1,
  limit: 10
};

const INITIAL_METADATA: SearchMetadata = {
  total: 0,
  totalPages: 0,
  page: 1,
  limit: 10
};

const StudentList: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>(INITIAL_SEARCH_PARAMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<SearchMetadata>(INITIAL_METADATA);

  const performSearch = useCallback(
    debounce(async (params: SearchParams): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const result = await studentApi.searchStudents(params);
        setStudents(result.data);
        setMetadata(result.metadata);
      } catch (err) {
        setError('Search failed. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  React.useEffect(() => {
    const loadFaculties = async (): Promise<void> => {
      try {
        const data = await studentApi.getFaculties();
        setFaculties(data);
      } catch (err) {
        setError('Failed to load faculties');
        console.error('Faculty loading error:', err);
      }
    };

    loadFaculties();
  }, []);

  const handleTextFieldChange = (field: keyof SearchParams) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newParams = {
      ...searchParams,
      [field]: event.target.value,
      page: 1
    };
    setSearchParams(newParams);
    performSearch(newParams);
  };

  const handleSelectChange = (event: SelectChangeEvent): void => {
    const newParams = {
      ...searchParams,
      facultyId: event.target.value,
      page: 1
    };
    setSearchParams(newParams);
    performSearch(newParams);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number): void => {
    const newParams = { ...searchParams, page: newPage };
    setSearchParams(newParams);
    performSearch(newParams);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Student Search
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Faculty</InputLabel>
              <Select
                value={searchParams.facultyId}
                label="Faculty"
                onChange={handleSelectChange}
              >
                <MenuItem value="">All Faculties</MenuItem>
                {faculties.map((faculty) => (
                  <MenuItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Student Name"
              value={searchParams.name}
              onChange={handleTextFieldChange('name')}
              sx={{ minWidth: 200 }}
            />

            <TextField
              label="Student Code"
              value={searchParams.studentCode}
              onChange={handleTextFieldChange('studentCode')}
              sx={{ minWidth: 200 }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Faculty</TableCell>
                  <TableCell>Program</TableCell>
                  <TableCell>Academic Standing</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <TableCell>{student.studentCode}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>{student.facultyName}</TableCell>
                      <TableCell>{student.programName}</TableCell>
                      <TableCell>{student.academicStanding}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {metadata.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={metadata.totalPages}
                page={searchParams.page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedStudentId}
        onClose={() => setSelectedStudentId(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ position: 'relative', p: 3 }}>
          <IconButton
            onClick={() => setSelectedStudentId(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedStudentId && (
            <StudentDetails studentId={selectedStudentId} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StudentList;