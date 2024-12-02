import {
  Box,
  Button,
  Container,
  Typography,
  Paper
} from '@mui/material';
import { School } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 5,
              mt: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 2
            }}
          >
            <School
              sx={{
                fontSize: 60,
                color: '#1976d2',
                mb: 2
              }}
            />
            <Typography
              component="h1"
              variant="h2"
              sx={{
                mb: 3,
                fontWeight: 'bold',
                color: '#1976d2'
              }}
            >
              UniManage
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                mb: 4,
                textAlign: 'center',
                color: '#666'
              }}
            >
              Streamline your university management with our comprehensive solution
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleLoginClick}
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.2rem',
                fontWeight: 'medium',
                borderRadius: 2
              }}
            >
              Login
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default MainPage;