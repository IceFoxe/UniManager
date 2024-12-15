import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';

interface ScheduleEvent {
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  day: string;
  group?: string;
}

const Schedule: React.FC = () => {
  const theme = useTheme();
  const days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
  const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7:00 to 19:00

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

  const borderColor = theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.12)'
    : 'rgba(0, 0, 0, 0.12)';

  const eventBgColor = theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 200, 0.5)';

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          overflowX: 'auto',
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2
        }}
      >
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '80px repeat(5, 1fr)',
          minWidth: 800,
          backgroundColor: theme.palette.background.paper
        }}>
          {/* Header row */}
          <Box sx={{
            gridColumn: '1 / 2',
            borderBottom: `1px solid ${borderColor}`,
            p: 1.5,
            color: theme.palette.text.secondary
          }}>
            Time
          </Box>
          {days.map(day => (
            <Box
              key={day}
              sx={{
                borderBottom: `1px solid ${borderColor}`,
                p: 1.5,
                fontWeight: 500,
                color: theme.palette.text.primary
              }}
            >
              {day}
            </Box>
          ))}

          {/* Time slots */}
          {hours.map(hour => (
            <React.Fragment key={hour}>
              {/* Time column */}
              <Box sx={{
                borderBottom: `1px solid ${borderColor}`,
                borderRight: `1px solid ${borderColor}`,
                p: 1.5,
                height: '100px',
                color: theme.palette.text.secondary
              }}>
                {`${hour.toString().padStart(2, '0')}:00`}
              </Box>

              {/* Day columns */}
              {days.map(day => {
                const event = getEventForTimeSlot(day, hour);
                return (
                  <Box
                    key={`${day}-${hour}`}
                    sx={{
                      borderBottom: `1px solid ${borderColor}`,
                      borderRight: `1px solid ${borderColor}`,
                      p: 1.5,
                      backgroundColor: event ? eventBgColor : 'transparent',
                      height: '100px',
                      transition: 'background-color 0.2s ease',
                      '&:hover': {
                        backgroundColor: event
                          ? theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(255, 255, 200, 0.7)'
                          : 'transparent'
                      }
                    }}
                  >
                    {event && (
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 500,
                            color: theme.palette.text.primary
                          }}
                        >
                          {event.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {event.location}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: theme.palette.text.disabled }}
                        >
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
    </Box>
  );
};

export default Schedule;