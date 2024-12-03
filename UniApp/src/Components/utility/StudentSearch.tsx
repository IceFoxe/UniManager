import {useState} from "react";
import {Alert, Box, Button, CircularProgress, List, ListItem, TextField} from "@mui/material";

interface SearchParams {
    facultyId: string;
    search?: string;
    programId?: string;
    year?: number;
    page?: number;
    limit?: number;
}

// Function to search students
const searchStudents = async (params: SearchParams) => {
    const queryString = new URLSearchParams();

    // Add required params
    queryString.append('facultyId', params.facultyId);

    // Add optional params
    if (params.search) queryString.append('search', params.search);
    if (params.programId) queryString.append('programId', params.programId);
    if (params.year) queryString.append('year', params.year.toString());
    if (params.page) queryString.append('page', params.page.toString());
    if (params.limit) queryString.append('limit', params.limit.toString());

    try {
        const response = await fetch(`/api/students/search?${queryString.toString()}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('Error searching students:', error);
        throw error;
    }
}

// Example usage in a React component
const StudentSearch: React.FC = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useState<SearchParams>({
        facultyId: '',
        page: 1,
        limit: 10
    });

    const handleSearch = async () => {
        try {
            setLoading(true);
            const result = await searchStudents(searchParams);
            setStudents(result.data);
            setError(null);
        } catch (err : any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <TextField
                label="Search"
                onChange={(e) => setSearchParams(prev => ({
                    ...prev,
                    search: e.target.value
                }))}
            />
            {/* Add other filter inputs as needed */}
            <Button onClick={handleSearch}>Search</Button>

            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            <List>
                {students.map(student => (
                    <ListItem key={student.id}>
                        {/* Render student information */}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default StudentSearch;