import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Link,
  useTheme
} from '@mui/material';

interface AccountPanelProps {
  initialData?: {
    username: string;
    email: string;
    bio: string;
    urls: string[];
  };
}

const AccountPanel: React.FC<AccountPanelProps> = ({ initialData = {
  username: 'shadcn',
  email: '',
  bio: 'I own a computer.',
  urls: ['https://shadcn.com', 'http://twitter.com/shadcn']
}}) => {
  const theme = useTheme();
  const [urls, setUrls] = useState<string[]>(initialData.urls);

  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        maxWidth: '600px'
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 1,
          fontWeight: 500
        }}
      >
        Profile
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mb: 4,
          color: theme.palette.text.secondary
        }}
      >
        This is how others will see you on the site.
      </Typography>

      {/* Username Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 2,
            fontWeight: 500
          }}
        >
          Username
        </Typography>
        <TextField
          fullWidth
          defaultValue={initialData.username}
          variant="outlined"
          size="small"
          sx={{
            mb: 1,
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.background.default
            }
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            display: 'block'
          }}
        >
          This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.
        </Typography>
      </Box>

      {/* Email Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 2,
            fontWeight: 500
          }}
        >
          Email
        </Typography>
        <Select
          fullWidth
          defaultValue=""
          size="small"
          sx={{
            mb: 1,
            backgroundColor: theme.palette.background.default
          }}
        >
          <MenuItem value="">Select a verified email to display</MenuItem>
        </Select>
        <Typography
          variant="caption"
          sx={{ color: theme.palette.text.secondary }}
        >
          You can manage verified email addresses in your{' '}
          <Link href="#" sx={{ color: theme.palette.primary.main }}>
            email settings
          </Link>
          .
        </Typography>
      </Box>

      {/* Bio Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 2,
            fontWeight: 500
          }}
        >
          Bio
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          defaultValue={initialData.bio}
          variant="outlined"
          size="small"
          sx={{
            mb: 1,
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.background.default
            }
          }}
        />
        <Typography
          variant="caption"
          sx={{ color: theme.palette.text.secondary }}
        >
          You can @mention other users and organizations to link to them.
        </Typography>
      </Box>

      {/* URLs Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 2,
            fontWeight: 500
          }}
        >
          URLs
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            display: 'block',
            mb: 2
          }}
        >
          Add links to your website, blog, or social media profiles.
        </Typography>
        {urls.map((url, index) => (
          <TextField
            key={index}
            fullWidth
            defaultValue={url}
            variant="outlined"
            size="small"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.default
              }
            }}
          />
        ))}
        <Button
          variant="outlined"
          size="small"
          onClick={handleAddUrl}
          sx={{
            textTransform: 'none',
            fontWeight: 400
          }}
        >
          Add URL
        </Button>
      </Box>

      {/* Update Button */}
      <Button
        variant="contained"
        sx={{
          textTransform: 'none',
          px: 4,
          fontWeight: 500
        }}
      >
        Update profile
      </Button>
    </Paper>
  );
};

export default AccountPanel;