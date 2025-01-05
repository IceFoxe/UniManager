import React, { useState, useCallback, useMemo } from 'react';
import type { Student, Faculty, SearchParams, SearchMetadata } from '../../types/student';
import type { StudentForm } from '../EntityViews/Forms/Student';
import studentApi from '../../services/studentApi';
import {
  Box,
  Card,
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
  IconButton,
  Button,
  styled,
  alpha,
  type Theme,
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { debounce, isArray } from 'lodash';
import StudentDetails from '../EntityViews/Uneditables/Student';
import StudentForm from '../EntityViews/Forms/Student';

// Theme and styling
const theme = {
  palette: {
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

// Styled components with strong typing
interface StyledContainerProps {
  theme: Theme;
}

const StyledCard = styled(Card)(({ theme }: StyledContainerProps) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.background.default,
  borderRadius: 8,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }: StyledContainerProps) => ({
  '& .MuiTableHead-root': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    '& .MuiTableCell-head': {
      color: theme.palette.common.white,
      fontWeight: 600,
      borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    },
  },
  '& .MuiTableBody-root .MuiTableCell-body': {
    color: alpha(theme.palette.common.white, 0.87),
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }: StyledContainerProps) => ({
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

// Constants
const INITIAL_SEARCH_PARAMS = {
  name: '',
  facultyId: '',
  studentCode: '',
  page: 1,
  limit: 10,
} as const satisfies SearchParams;

const INITIAL_METADATA = {
  total: 0,
  totalPages: 0,
  page: 1,
  limit: 10,
} as const satisfies SearchMetadata;

// Component
const StudentList = () => {
  // State
  const [searchParams, setSearchParams] = useState<SearchParams>(INITIAL_SEARCH_PARAMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<SearchMetadata>(INITIAL_METADATA);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Search handler with debounce
  const performSearch = useMemo(
      () => debounce(async (params: SearchParams): Promise<void> => {
        try {
          setLoading(true);
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

  // Load faculties on mount
  React.useEffect(() => {
    const loadFaculties = async () => {
      try {
        const data = await studentApi.getFaculties();
        setFaculties(isArray(data.data) ? data.data : []);
      } catch (err) {
        setError('Nie udało się załadować wydziałów');
        console.error('Faculty loading error:', err);
      }
    };

    void loadFaculties();
  }, []);

  // Event handlers
  const handleTextFieldChange = useCallback((field: keyof SearchParams) => (
      event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newParams = {
      ...searchParams,
      [field]: event.target.value,
      page: 1,
    };
    setSearchParams(newParams);
    void performSearch(newParams);
  }, [searchParams, performSearch]);

  const handleSelectChange = useCallback((event: SelectChangeEvent): void => {
    const newParams = {
      ...searchParams,
      facultyId: event.target.value,
      page: 1,
    };
    setSearchParams(newParams);
    void performSearch(newParams);
  }, [searchParams, performSearch]);

  const handleAddStudent = async (studentData: StudentFormData) => {
    try {
      setLoading(true);
      await studentApi.createStudent({
        ...studentData,
        studentCode: studentData.studentNumber,
      });
      setIsAddDialogOpen(false);
      void performSearch(searchParams);
    } catch (err) {
      setError('Nie udało się utworzyć studenta');
      console.error('Create student error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Memoized components
  const SearchBar = useMemo(() => (
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Wydział</InputLabel>
          <Select
              value={searchParams.facultyId}
              label="Wydział"
              onChange={handleSelectChange}
              sx={{ color: 'white' }}
          >
            <MenuItem value="">Wszystkie wydziały</MenuItem>
            {faculties.map((faculty) => (
                <MenuItem key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </MenuItem>
            ))}
          </Select>
        </FormControl>

        {[
          { label: 'Imię i Nazwisko', field: 'name' as const },
          { label: 'Indeks studenta', field: 'studentCode' as const },
        ].map(({ label, field }) => (
            <TextField
                key={field}
                label={label}
                value={searchParams[field]}
                onChange={handleTextFieldChange(field)}
                sx={{ minWidth: 200 }}
            />
        ))}
      </Box>
  ), [searchParams, faculties, handleSelectChange, handleTextFieldChange]);

  const StudentTable = useMemo(() => (
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {['Numer Indeksu', 'Imię i Nazwisko', 'Program Studiów', 'Status'].map((header) => (
                  <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <CircularProgress sx={{ color: theme.palette.primary.light }} />
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
                    <StyledTableRow
                        key={student.id}
                        onClick={() => setSelectedStudentId(student.id)}
                    >
                      <TableCell>{student.studentCode}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>{student.programName}</TableCell>
                      <TableCell>{student.academicStanding}</TableCell>
                    </StyledTableRow>
                ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
  ), [loading, students]);

  const DialogList = useMemo(() => [
    {
      open: !!selectedStudentId,
      onClose: () => setSelectedStudentId(null),
      content: selectedStudentId && <StudentDetails studentId={selectedStudentId} />,
    },
    {
      open: isAddDialogOpen,
      onClose: () => setIsAddDialogOpen(false),
      content: (
          <StudentForm
              onSubmit={handleAddStudent}
              onClose={() => setIsAddDialogOpen(false)}
              isLoading={loading}
          />
      ),
    },
  ], [selectedStudentId, isAddDialogOpen, loading, handleAddStudent]);

  return (
      <Box sx={{ m: 0, p: 3, width: '100%' }}>
        <StyledCard>
          <Box sx={{ p: 3 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
              <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 600
                  }}
              >
                Wyszukaj Studenta
              </Typography>
              <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsAddDialogOpen(true)}
                  sx={{
                    height: 40,
                    bgcolor: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                  }}
              >
                Dodaj Studenta
              </Button>
            </Box>

            {SearchBar}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: 'white',
                    }}
                >
                  {error}
                </Alert>
            )}

            {StudentTable}

            {metadata.totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination
                      count={metadata.totalPages}
                      page={searchParams.page}
                      onChange={(_, page) => void performSearch({ ...searchParams, page })}
                      sx={{
                        '.MuiPaginationItem-root': {
                          color: 'white',
                        },
                        '.Mui-selected': {
                          bgcolor: theme.palette.primary.main,
                          '&:hover': {
                            bgcolor: theme.palette.primary.dark,
                          },
                        },
                      }}
                  />
                </Box>
            )}
          </Box>
        </StyledCard>

        {DialogList.map((dialog, index) => (
            <Dialog
                key={index}
                open={dialog.open}
                onClose={dialog.onClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                  sx: {
                    bgcolor: theme.palette.background.paper,
                    color: 'white',
                  },
                }}
            >
              <Box sx={{ position: 'relative', p: 3 }}>
                <IconButton
                    onClick={dialog.onClose}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      zIndex: 1,
                      color: 'white',
                      '&:hover': {
                        color: theme.palette.primary.light,
                      },
                    }}
                >
                  <CloseIcon />
                </IconButton>
                {dialog.content}
              </Box>
            </Dialog>
        ))}
      </Box>
  );
};

export default React.memo(StudentList);