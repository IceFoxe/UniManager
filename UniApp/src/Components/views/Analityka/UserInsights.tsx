import { Box, Typography, Paper } from '@mui/material';

const UserInsights: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>User Insights</Typography>
      <Box sx={{
        display: 'flex',
        gap: 3,
        flexWrap: 'wrap'
      }}>
        <Paper sx={{ flex: 1, p: 3, minWidth: 250 }}>
          <Typography variant="h6">Age Distribution</Typography>
          <Typography variant="body1">18-24: 30%</Typography>
          <Typography variant="body1">25-34: 45%</Typography>
          <Typography variant="body1">35+: 25%</Typography>
        </Paper>

        <Paper sx={{ flex: 1, p: 3, minWidth: 250 }}>
          <Typography variant="h6">Gender</Typography>
          <Typography variant="body1">Male: 55%</Typography>
          <Typography variant="body1">Female: 44%</Typography>
          <Typography variant="body1">Other: 1%</Typography>
        </Paper>

        <Paper sx={{ flex: 1, p: 3, minWidth: 250 }}>
          <Typography variant="h6">Location</Typography>
          <Typography variant="body1">North America: 40%</Typography>
          <Typography variant="body1">Europe: 35%</Typography>
          <Typography variant="body1">Asia: 25%</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default UserInsights;