import React, { useState, useCallback, useEffect } from 'react';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Alert,
    Dialog,
    IconButton,
    Button,
    Chip,
    styled,
    alpha,
    type Theme,
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import axios, { AxiosResponse } from 'axios';

// Type definitions that match our API response
interface Course {
    id: number;
    name: string;
    code: string;
    credits: number | null;
    semester: number | null;
    mandatory: boolean;
    programName: string;
    teacherName: string;
}

interface ApiMetadata {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface ApiResponse<T> {
    data: T;
    metadata: ApiMetadata;
}

// Theme configuration - maintaining consistency with other views
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

// API service with type-safe response handling
const courseApi = {
    getCourses: () =>
        axios.get<unknown, AxiosResponse<ApiResponse<Course[]>>>('http://localhost:3001/api/courses'),
    getCourseById: (id: number) =>
        axios.get<unknown, AxiosResponse<ApiResponse<Course>>>(`http://localhost:3001/api/courses/${id}`),
} as const;

// Styled components for consistent visual presentation
const StyledCard = styled(Card)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }: { theme: Theme }) => ({
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

const StyledTableRow = styled(TableRow)(({ theme }: { theme: Theme }) => ({
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
}));

const MandatoryChip = styled(Chip)<{ mandatory: boolean }>(
    ({mandatory }) => ({
        backgroundColor: alpha(mandatory ? '#4caf50' : '#757575', 0.1),
        color: mandatory ? '#4caf50' : '#757575',
        borderRadius: '4px',
        '.MuiChip-label': {
            padding: '4px 8px',
        },
    })
);

// Column configuration for the table
const columns = [
    {
        id: 'code' as const,
        label: 'Kod',
        render: (course: Course) => course.code,
    },
    {
        id: 'name' as const,
        label: 'Nazwa',
        render: (course: Course) => course.name,
    },
    {
        id: 'programName' as const,
        label: 'Kierunek',
        render: (course: Course) => course.programName,
    },
    {
        id: 'teacherName' as const,
        label: 'Prowadzący',
        render: (course: Course) => course.teacherName !== 'undefined undefined'
            ? course.teacherName
            : 'Nie przypisano',
    },
    {
        id: 'semester' as const,
        label: 'Semestr',
        render: (course: Course) => course.semester ?? '-',
    },
    {
        id: 'credits' as const,
        label: 'ECTS',
        render: (course: Course) => course.credits ?? '-',
    },
    {
        id: 'mandatory' as const,
        label: 'Status',
        render: (course: Course) => (
            <MandatoryChip
                label={course.mandatory ? 'Obowiązkowy' : 'Fakultatywny'}
                mandatory={course.mandatory}
                size="small"
            />
        ),
    },
] as const;

const CourseList = () => {
    // State management
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Data fetching with error handling
    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await courseApi.getCourses();
            setCourses(response.data.data);
        } catch (err) {
            console.error('Course fetch error:', err);
            setError('Nie udało się załadować kursów');
            setCourses([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchCourses();
    }, [fetchCourses]);

    // Memoized table component
    const renderTable = React.useMemo(() => (
        <StyledTableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.id}>{column.label}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                <CircularProgress sx={{ color: theme.palette.primary.light }} />
                            </TableCell>
                        </TableRow>
                    ) : courses.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                Nie znaleziono kursów
                            </TableCell>
                        </TableRow>
                    ) : (
                        courses.map((course) => (
                            <StyledTableRow
                                key={course.id}
                                onClick={() => setSelectedCourseId(course.id)}
                            >
                                {columns.map((column) => (
                                    <TableCell key={column.id}>
                                        {column.render(course)}
                                    </TableCell>
                                ))}
                            </StyledTableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </StyledTableContainer>
    ), [loading, courses]);

    // Memoized dialogs configuration
    const renderDialogs = React.useMemo(() => [
        {
            open: !!selectedCourseId,
            onClose: () => setSelectedCourseId(null),
            title: 'Szczegóły Kursu',
            content: selectedCourseId && (
                <Box sx={{ minHeight: '200px' }}>
                    {courses.find(c => c.id === selectedCourseId)?.name}
                </Box>
            ),
        },
        {
            open: isAddDialogOpen,
            onClose: () => setIsAddDialogOpen(false),
            title: 'Dodaj Kurs',
            content: (
                <Box sx={{ minHeight: '200px' }}>
                    {/* CourseForm component placeholder */}
                </Box>
            ),
        },
    ], [selectedCourseId, isAddDialogOpen, courses]);

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
                            Lista Kursów
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
                            Dodaj Kurs
                        </Button>
                    </Box>

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

                    {renderTable}
                </Box>
            </StyledCard>

            {renderDialogs.map((dialog, index) => (
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
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2,
                                color: theme.palette.primary.light,
                                fontWeight: 600,
                            }}
                        >
                            {dialog.title}
                        </Typography>

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

export default React.memo(CourseList);