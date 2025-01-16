import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  useTheme,
  CircularProgress,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import Schedule from './Schedule';

interface Grade {
  courseName: string;
  value: string | number; // Handle both string and number types
  course_id: string;
  createdAt: string;
  date: string | Date;
}

interface AuthUser {
  entity_id: string;
  token: string;
}

const Overview: React.FC = () => {
  const theme = useTheme();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const userDataStr = localStorage.getItem('user');

        if (!authToken || !userDataStr) {
          throw new Error('No authentication data found');
        }

        const userData = JSON.parse(userDataStr) as AuthUser;

        const response = await fetch(`http://localhost:3001/api/grades/student/${userData.entity_id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expired: Please log in again');
          }
          throw new Error('Failed to fetch grades');
        }

        const { data } = await response.json();
        const sortedGrades = data
          .sort((a: Grade, b: Grade) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 4);

        setGrades(sortedGrades);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const getGradeColor = (gradeValue: string | number): 'success' | 'info' | 'warning' | 'error' => {
    const numericGrade = typeof gradeValue === 'string' ? parseFloat(gradeValue) : gradeValue;
    if (numericGrade >= 4.5) return 'success';
    if (numericGrade >= 4.0) return 'info';
    if (numericGrade >= 3.0) return 'warning';
    return 'error';
  };

  const formatGradeValue = (gradeValue: string | number): string => {
    const numericGrade = typeof gradeValue === 'string' ? parseFloat(gradeValue) : gradeValue;
    return numericGrade.toFixed(1);
  };

  const renderGradesSection = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    return (
      <List sx={{ p: 0 }}>
        {grades.map((grade, index) => (
          <ListItem
            key={`${grade.course_id}-${index}`}
            divider={index !== grades.length - 1}
            sx={{
              py: 2,
              px: 0,
              borderColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(0, 0, 0, 0.12)'
            }}
          >
            <ListItemText
              primary={
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 500
                    }}
                  >
                    {grade.courseName}
                  </Typography>
                  <Chip
                    label={formatGradeValue(grade.value)}
                    color={getGradeColor(grade.value)}
                    size="small"
                    sx={{
                      fontWeight: 500,
                      minWidth: '45px'
                    }}
                  />
                </Box>
              }
              secondary={
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 1
                }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 400
                    }}
                  >
                    {format(new Date(grade.date), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
        {grades.length === 0 && (
          <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
            No grades found
          </Typography>
        )}
      </List>
    );
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', width: '100%', height: '100%' }}>
      <Box sx={{
        flex: '1 1 auto',
        maxWidth: '65%',
        minWidth: '600px',
        '@media (max-width: 1200px)': { maxWidth: '100%' }
      }}>
        <Schedule />
      </Box>

      <Box sx={{
        flex: '1 1 300px',
        minWidth: '300px',
        maxWidth: '35%',
        '@media (max-width: 1200px)': { maxWidth: '100%' }
      }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: '100%',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 3 }}>
            Ostatnie Oceny
          </Typography>
          {renderGradesSection()}
        </Paper>
      </Box>
    </Box>
  );
};

export default Overview;