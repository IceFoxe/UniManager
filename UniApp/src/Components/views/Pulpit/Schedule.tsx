import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface ScheduleEvent {
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  day: string;
  group?: string;
}

const Schedule: React.FC = () => {
  const days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
  const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7:00 to 19:00

  // Example schedule data
  const scheduleEvents: ScheduleEvent[] = [
    {
      title: 'Modelowanie i symulacja',
      location: 'W. gr. 1 (29, bud. D-1)',
      startTime: '11:15',
      endTime: '13:00',
      day: 'Poniedziałek'
    },
    {
      title: 'Podstawy sieci neuronowych',
      location: 'W. gr. 1.01.1, bud. C-16',
      startTime: '13:15',
      endTime: '15:00',
      day: 'Poniedziałek'
    },
    {
      title: 'Sterowanie adaptacyjne',
      location: 'W. gr. 1 (29, bud. D-1)',
      startTime: '9:15',
      endTime: '11:00',
      day: 'Wtorek'
    },
    // Add more events as needed
  ];

  const getEventForTimeSlot = (day: string, hour: number) => {
    return scheduleEvents.find(event => {
      const eventStart = parseInt(event.startTime.split(':')[0]);
      const eventEnd = parseInt(event.endTime.split(':')[0]);
      return event.day === day && hour >= eventStart && hour < eventEnd;
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 2, overflowX: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Schedule
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', minWidth: 800 }}>
        {/* Header row */}
        <Box sx={{
          gridColumn: '1 / 2',
          borderBottom: '1px solid rgba(224, 224, 224, 1)',
          p: 1
        }}>
          Time
        </Box>
        {days.map(day => (
          <Box key={day} sx={{
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            p: 1,
            fontWeight: 'bold'
          }}>
            {day}
          </Box>
        ))}

        {/* Time slots */}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            {/* Time column */}
            <Box sx={{
              borderBottom: '1px solid rgba(224, 224, 224, 1)',
              borderRight: '1px solid rgba(224, 224, 224, 1)',
              p: 1,
              height: '100px'
            }}>
              {`${hour}:00`}
            </Box>

            {/* Day columns */}
            {days.map(day => {
              const event = getEventForTimeSlot(day, hour);
              return (
                <Box key={`${day}-${hour}`} sx={{
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  borderRight: '1px solid rgba(224, 224, 224, 1)',
                  p: 1,
                  backgroundColor: event ? 'rgba(255, 255, 200, 0.5)' : 'transparent',
                  height: '100px'
                }}>
                  {event && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {event.location}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {`${event.startTime} - ${event.endTime}`}
                      </Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  );
};

export default Schedule;