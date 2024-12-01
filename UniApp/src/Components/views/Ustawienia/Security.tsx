import { Box, Typography, Card, CardContent } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import TimerIcon from '@mui/icons-material/Timer';

const Security: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Overview Dashboard</Typography>
      <Box sx={{
        display: 'flex',
        gap: 3,
        flexWrap: 'wrap'
      }}>
        <Card sx={{ flex: 1, minWidth: 300 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Active Users</Typography>
              <PeopleIcon color="primary" />
            </Box>
            <Typography variant="h3">2,453</Typography>
            <Typography variant="body2" color="text.secondary">↑ 12% since last week</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 300 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Engagement Rate</Typography>
              <TrendingUpIcon color="primary" />
            </Box>
            <Typography variant="h3">67%</Typography>
            <Typography variant="body2" color="text.secondary">↑ 5% since last month</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 300 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Avg. Session</Typography>
              <TimerIcon color="primary" />
            </Box>
            <Typography variant="h3">24m</Typography>
            <Typography variant="body2" color="text.secondary">↓ 2% since yesterday</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Security;