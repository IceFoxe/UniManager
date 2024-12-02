import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { format } from 'date-fns';

interface Grade {
  subject: string;
  grade: number;
  date: string;
  type: string;
}

interface ClassSchedule {
  day: string;
  classes: {
    time: string;
    subject: string;
    room: string;
    professor: string;
  }[];
}

const Overview: React.FC = () => {
  // Example data - replace with actual API calls
  const recentGrades: Grade[] = [
    { subject: 'Mathematics', grade: 4.5, date: '2024-02-28', type: 'Exam' },
    { subject: 'Physics', grade: 5.0, date: '2024-02-25', type: 'Quiz' },
    { subject: 'Programming', grade: 4.0, date: '2024-02-20', type: 'Project' },
    { subject: 'English', grade: 4.5, date: '2024-02-18', type: 'Presentation' }
  ];

  const weeklySchedule: ClassSchedule[] = [
    {
      day: 'Monday',
      classes: [
        { time: '8:00-9:30', subject: 'Mathematics', room: '204A', professor: 'Dr. Smith' },
        { time: '10:00-11:30', subject: 'Physics', room: '105B', professor: 'Dr. Johnson' }
      ]
    },
    {
      day: 'Tuesday',
      classes: [
        { time: '9:00-10:30', subject: 'Programming', room: '302C', professor: 'Prof. Williams' }
      ]
    },
    // Add other days as needed
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
      <Box sx={{ flex: '1 1 600px', minWidth: 0 }}>
        <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Weekly Schedule
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="15%"><strong>Time</strong></TableCell>
                  <TableCell width="25%"><strong>Subject</strong></TableCell>
                  <TableCell width="15%"><strong>Room</strong></TableCell>
                  <TableCell width="45%"><strong>Professor</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {weeklySchedule.map((day) => (
                  <React.Fragment key={day.day}>
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', py: 1 }}>
                          {day.day}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {day.classes.map((class_, index) => (
                      <TableRow key={`${day.day}-${index}`}>
                        <TableCell>{class_.time}</TableCell>
                        <TableCell>{class_.subject}</TableCell>
                        <TableCell>{class_.room}</TableCell>
                        <TableCell>{class_.professor}</TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

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