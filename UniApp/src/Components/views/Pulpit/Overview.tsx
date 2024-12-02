import React from 'react';
import {
  Box,
  Paper,
  Typography,

  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import Schedule from './Schedule.tsx'
interface Grade {
  subject: string;
  grade: number;
  date: string;
  type: string;
}


const Overview: React.FC = () => {
  // Example data - replace with actual API calls
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
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {/* Timetable Section */}
      <Schedule/>

      {/* Recent Grades Section */}
      <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
        <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Recent Grades
          </Typography>
          <List>
            {recentGrades.map((grade, index) => (
              <ListItem
                key={index}
                divider={index !== recentGrades.length - 1}
                sx={{ py: 2 }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1">{grade.subject}</Typography>
                      <Chip
                        label={grade.grade}
                        color={getGradeColor(grade.grade) as any}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {grade.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
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