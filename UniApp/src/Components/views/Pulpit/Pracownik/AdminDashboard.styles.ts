export const styles = {
  mainContainer: {
    p: 3,
    bgcolor: '#151515',
    minHeight: '100vh',
    color: 'white'
  },
  tabs: {
    mb: 3,
    '& .MuiTab-root': {
      color: 'grey.500',
      '&.Mui-selected': {
        color: '#5d2365'
      }
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#5d2365'
    }
  },
  quickActionButton: {
    bgcolor: '#5d2365',
    '&:hover': {
      bgcolor: '#a352b1'
    },
    width: '100%',
    mb: 2
  },
  card: {
    bgcolor: 'rgba(26, 26, 26, 0.6)',
    border: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    mb: 2
  },
  cardTitle: {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 1
  },
  inputField: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: '#81298F',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#5d2365',
      },
      '& input': {
        color: 'white',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'grey.500',
      '&.Mui-focused': {
        color: '#5d2365',
      },
    },
    '& .MuiSelect-icon': {
      color: 'grey.500',
    },
    mb: 2
  },
  dialog: {
    '& .MuiDialog-paper': {
      bgcolor: '#151515',
      color: 'white'
    }
  },
  dialogTitle: {
    color: 'white'
  },
  dialogButton: {
    bgcolor: '#5d2365',
    '&:hover': {
      bgcolor: '#a352b1'
    }
  },
  tableContainer: {
    bgcolor: 'rgba(26, 26, 26, 0.6)',
    '& .MuiTableCell-root': {
      color: 'white',
      borderColor: 'rgba(255, 255, 255, 0.1)'
    }
  }
};

export default styles;