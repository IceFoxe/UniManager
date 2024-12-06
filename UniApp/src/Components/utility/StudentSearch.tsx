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
  IconButton,
  Button
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { debounce } from 'lodash';
import StudentDetails from '../EntityViews/Uneditables/Student';
import StudentForm from '../EntityViews/Forms/Student';
interface StudentFormData {
  firstName: string;
  lastName: string;
  studentNumber: string;
  facultyId: string;
  programId: string;
  semester: number;
  status: 'ACTIVE' | 'SUSPENDED';
  enrollmentDate: Date | null;
  expectedGraduationDate: Date | null;
}
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const performSearch = useCallback(
    debounce(async (params: SearchParams): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const result = await studentApi.searchStudents(params);
        setStudents(result.data);
        setMetadata(result.metadata);
      } catch (err) {
        setError('Wyszukiwanie nie powiodło się. Spróbuj ponownie.');
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
        setError('Nie udało się załadować wydziałów');
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

  const handleAddStudent = async (studentData: StudentFormData) => {
    try {
      setLoading(true);
      await studentApi.createStudent({
        ...studentData,
        studentCode: studentData.studentNumber // mapping to match API expectations
      });
      setIsAddDialogOpen(false);
      performSearch(searchParams);
    } catch (err) {
      setError('Nie udało się utworzyć studenta');
      console.error('Create student error:', err);
    } finally {
      setLoading(false);
    }
  };
  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
    setError(null);
  };

  const handleCloseDetailsDialog = () => {
    setSelectedStudentId(null);
    setError(null);
  };

  const renderSearchBar = () => (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Wydział</InputLabel>
        <Select
          value={searchParams.facultyId}
          label="Wydział"
          onChange={handleSelectChange}
        >
          <MenuItem value="">Wszystkie wydziały</MenuItem>
          {faculties.map((faculty) => (
            <MenuItem key={faculty.id} value={faculty.id}>
              {faculty.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Imię i Nazwisko"
        value={searchParams.name}
        onChange={handleTextFieldChange('name')}
        sx={{ minWidth: 200 }}
      />

      <TextField
        label="Indeks studenta"
        value={searchParams.studentCode}
        onChange={handleTextFieldChange('studentCode')}
        sx={{ minWidth: 200 }}
      />
    </Box>
  );

  const renderTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Numer Indeksu</TableCell>
            <TableCell>Imię i Nazwisko</TableCell>
            <TableCell>Program Studiów</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                Nie znaleziono studentów
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
                <TableCell>{student.programName}</TableCell>
                <TableCell>{student.academicStanding}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ margin: '0 auto', p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h4" sx={{ margin: '5px 10px 25px 5px' }}>
              Wyszukaj Studenta
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddDialogOpen(true)}
              sx={{ height: 40 }}
            >
              Dodaj Studenta
            </Button>
          </Box>

          {renderSearchBar()}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {renderTable()}

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
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ position: 'relative', p: 3 }}>
          <IconButton
            onClick={handleCloseDetailsDialog}
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

      <Dialog
      open={isAddDialogOpen}
      onClose={handleCloseAddDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogContent sx={{ position: 'relative', p: 3 }}>
        <IconButton
          onClick={handleCloseAddDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1
          }}
        >
          <CloseIcon />
        </IconButton>
        <StudentForm
          onSubmit={handleAddStudent}
          onClose={handleCloseAddDialog}
        />
      </DialogContent>
    </Dialog>
    </Box>
  );
};

export default StudentList;