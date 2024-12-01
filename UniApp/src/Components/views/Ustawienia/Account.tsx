import { Box, Typography, Paper, TextField, Button } from '@mui/material';

const Account: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Account Settings</Typography>
      <Paper sx={{ p: 3 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          <Box sx={{
            display: 'flex',
            gap: 3,
            flexWrap: 'wrap'
          }}>
            <TextField
              sx={{ flex: 1, minWidth: 250 }}
              label="Username"
              defaultValue="john.doe"
            />
            <TextField
              sx={{ flex: 1, minWidth: 250 }}
              label="Email"
              defaultValue="john@example.com"
            />
          </Box>
          <Box>
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Account;