import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const Permissions: React.FC = () => {
  const trends = [
    { metric: 'User Growth', current: '+15%', previous: '+12%' },
    { metric: 'Revenue', current: '+22%', previous: '+18%' },
    { metric: 'Engagement', current: '+8%', previous: '+5%' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Trend Analysis</Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              <TableCell>Current Period</TableCell>
              <TableCell>Previous Period</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trends.map((row) => (
              <TableRow key={row.metric}>
                <TableCell>{row.metric}</TableCell>
                <TableCell>{row.current}</TableCell>
                <TableCell>{row.previous}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Permissions;