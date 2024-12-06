import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import Schedule from './Schedule';

interface Grade {
  subject: string;
  grade: number;
  date: string;
  type: string;
}

const Overview: React.FC = () => {
  const theme = useTheme();

  const recentGrades: Grade[] = [
    { subject: 'Mathematics', grade: 4.5, date: '2024-02-28', type: 'Exam' },
    { subject: 'Physics', grade: 5.0, date: '2024-02-25', type: 'Quiz' },
    { subject: 'Programming', grade: 4.0, date: '2024-02-20', type: 'Project' },
    { subject: 'English', grade: 4.5, date: '2024-02-18', type: 'Presentation' }
  ];

  const getGradeColor = (grade: number): string => {
    if (grade >= 4.5) return 'success';
    if (grade >= 4.0) return 'info';
    if (grade >= 3.0) return 'warning';
    return 'error';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        flexWrap: 'wrap',
        width: '100%',
        height: '100%'
      }}
    >
      {/* Timetable Section */}
      <Box
        sx={{
          flex: '1 1 auto',
          maxWidth: '65%',
          minWidth: '600px',
          '@media (max-width: 1200px)': {
            maxWidth: '100%'
          }
        }}
      >
        <Schedule />
      </Box>

      {/* Recent Grades Section */}
      <Box
        sx={{
          flex: '1 1 300px',
          minWidth: '300px',
          maxWidth: '35%',
          '@media (max-width: 1200px)': {
            maxWidth: '100%'
          }
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: '100%',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 500,
              mb: 3
            }}
          >
            Recent Grades
          </Typography>
          <List sx={{ p: 0 }}>
            {recentGrades.map((grade, index) => (
              <ListItem
                key={index}
                divider={index !== recentGrades.length - 1}
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
                        {grade.subject}
                      </Typography>
                      <Chip
                        label={grade.grade.toFixed(1)}
                        color={getGradeColor(grade.grade) as 'success'}
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
                      justifyContent: 'space-between',
                      mt: 1
                    }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: 400
                        }}
                      >
                        {grade.type}
                      </Typography>
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
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default Overview;