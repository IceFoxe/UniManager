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
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Dialog,
    IconButton,
    Button,
    styled,
    alpha,
    type Theme,
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import axios, { AxiosResponse } from 'axios';

// Types
interface Faculty {
    id: number;
    name: string;
    code: string;
    programsCount: number;
}

interface ApiMetadata {
    page: number;
    totalPages: number;
    totalItems: number;
}

interface ApiResponse<T> {
    data: {
        data: T;
        metadata: ApiMetadata;
    };
}

interface StyledComponentProps {
    theme: Theme;
}

// Theme configuration
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

// API service
const facultyApi = {
    getFaculties: () =>
        axios.get<unknown, AxiosResponse<ApiResponse<Faculty[]>>>('http://localhost:3001/api/faculties'),

    getFacultyById: (id: number) =>
        axios.get<unknown, AxiosResponse<ApiResponse<Faculty>>>(`http://localhost:3001/api/faculties/${id}`),
} as const;

// Styled components
const StyledCard = styled(Card)(({ theme }: StyledComponentProps) => ({
    backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.background.paper
        : theme.palette.background.default,
    borderRadius: 8,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }: StyledComponentProps) => ({
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

const StyledTableRow = styled(TableRow)(({ theme }: StyledComponentProps) => ({
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
}));

// Column configuration
const columns = [
    {
        id: 'code',
        label: 'Kod Wydziału',
        render: (faculty: Faculty) => faculty.code,
    },
    {
        id: 'name',
        label: 'Nazwa',
        render: (faculty: Faculty) => faculty.name,
    },
    {
        id: 'programsCount',
        label: 'Liczba Kierunków',
        render: (faculty: Faculty) => faculty.programsCount,
    },
] as const;

const FacultyList = () => {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Data fetching
    const fetchFaculties = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await facultyApi.getFaculties();
            console.log(response.data);
            if (!response?.data?.data) {
                throw new Error('Invalid API response structure');
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setFaculties(response.data.data);
        } catch (err) {
            console.error('Faculty fetch error:', err);
            setError('Nie udało się załadować wydziałów');
            setFaculties([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchFaculties();
    }, [fetchFaculties]);

    // Memoized components
    const renderTable = React.useMemo(() => (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        <StyledTableContainer component={Paper}>
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
                    ) : faculties.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                Nie znaleziono wydziałów
                            </TableCell>
                        </TableRow>
                    ) : (
                        faculties.map((faculty) => (
                            <StyledTableRow
                                key={faculty.id}
                                onClick={() => setSelectedFacultyId(faculty.id)}
                            >
                                {columns.map((column) => (
                                    <TableCell key={column.id}>
                                        {column.render(faculty)}
                                    </TableCell>
                                ))}
                            </StyledTableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </StyledTableContainer>
    ), [loading, faculties]);

    const renderDialogs = React.useMemo(() => [
        {
            open: !!selectedFacultyId,
            onClose: () => setSelectedFacultyId(null),
            title: 'Szczegóły Wydziału',
            content: selectedFacultyId && (
                <Box sx={{ minHeight: '200px' }}>
                    {faculties.find(f => f.id === selectedFacultyId)?.name}
                </Box>
            ),
        },
        {
            open: isAddDialogOpen,
            onClose: () => setIsAddDialogOpen(false),
            title: 'Dodaj Wydział',
            content: (
                <Box sx={{ minHeight: '200px' }}>
                    {/* Placeholder for FacultyForm component */}
                </Box>
            ),
        },
    ], [selectedFacultyId, isAddDialogOpen, faculties]);

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
                            Lista Wydziałów
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
                            Dodaj Wydział
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

export default React.memo(FacultyList);