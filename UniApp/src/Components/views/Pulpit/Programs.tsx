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
    Chip,
    styled,
    alpha,
    type Theme,
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import axios, { AxiosResponse } from 'axios';

type DegreeLevel = 'Bachelor' | 'Master' | 'PhD';

interface Program {
    id: number;
    name: string;
    code: string;
    degreeLevel: DegreeLevel;
    facultyName: string;
    isActive: boolean;
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

interface StyledComponentProps {
    theme: Theme;
}

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

const programApi = {
    getPrograms: () =>
        axios.get<unknown, AxiosResponse<ApiResponse<Program[]>>>('http://localhost:3001/api/programs'),

    getProgramById: (id: number) =>
        axios.get<unknown, AxiosResponse<ApiResponse<Program>>>(`/http://localhost:3001/api/programs/${id}`),
} as const;

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

const DegreeLevelChip = styled(Chip)<{ degreelevel: DegreeLevel }>(
    ({  degreelevel }) => ({
        backgroundColor: alpha(
            degreelevel === 'Bachelor' ? '#4caf50' :
                degreelevel === 'Master' ? '#2196f3' : '#9c27b0',
            0.1
        ),
        color: degreelevel === 'Bachelor' ? '#4caf50' :
            degreelevel === 'Master' ? '#2196f3' : '#9c27b0',
        borderRadius: '4px',
        '.MuiChip-label': {
            padding: '4px 8px',
        },
    })
);

const StatusChip = styled(Chip)<{ active: boolean }>(
    ({ active }) => ({
        backgroundColor: alpha(active ? '#4caf50' : '#f44336', 0.1),
        color: active ? '#4caf50' : '#f44336',
        borderRadius: '4px',
        '.MuiChip-label': {
            padding: '4px 8px',
        },
    })
);

const columns = [
    {
        id: 'code' as const,
        label: 'Kod',
        render: (program: Program) => program.code,
    },
    {
        id: 'name' as const,
        label: 'Nazwa',
        render: (program: Program) => program.name,
    },
    {
        id: 'facultyName' as const,
        label: 'Wydział',
        render: (program: Program) => program.facultyName,
    },
    {
        id: 'degreeLevel' as const,
        label: 'Poziom',
        render: (program: Program) => (
            <DegreeLevelChip
                label={program.degreeLevel}
                degreelevel={program.degreeLevel}
                size="small"
            />
        ),
    },
    {
        id: 'status' as const,
        label: 'Status',
        render: (program: Program) => (
            <StatusChip
                label={program.isActive ? 'Aktywny' : 'Nieaktywny'}
                active={program.isActive}
                size="small"
            />
        ),
    },
] as const;

const ProgramList = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const fetchPrograms = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await programApi.getPrograms();
            setPrograms(response.data.data);
        } catch (err) {
            console.error('Program fetch error:', err);
            setError('Nie udało się załadować programów');
            setPrograms([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchPrograms();
    }, [fetchPrograms]);

    const renderTable = React.useMemo(() => (
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
                    ) : programs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                Nie znaleziono programów
                            </TableCell>
                        </TableRow>
                    ) : (
                        programs.map((program) => (
                            <StyledTableRow
                                key={program.id}
                                onClick={() => setSelectedProgramId(program.id)}
                            >
                                {columns.map((column) => (
                                    <TableCell key={column.id}>
                                        {column.render(program)}
                                    </TableCell>
                                ))}
                            </StyledTableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </StyledTableContainer>
    ), [loading, programs]);

    const renderDialogs = React.useMemo(() => [
        {
            open: !!selectedProgramId,
            onClose: () => setSelectedProgramId(null),
            title: 'Szczegóły Programu',
            content: selectedProgramId && (
                <Box sx={{ minHeight: '200px' }}>
                    {programs.find(p => p.id === selectedProgramId)?.name}
                </Box>
            ),
        },
        {
            open: isAddDialogOpen,
            onClose: () => setIsAddDialogOpen(false),
            title: 'Dodaj Program',
            content: (
                <Box sx={{ minHeight: '200px' }}>
                    {/* Form component placeholder */}
                </Box>
            ),
        },
    ], [selectedProgramId, isAddDialogOpen, programs]);

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
                            Lista Kierunków
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
                            Dodaj Program
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

export default React.memo(ProgramList);