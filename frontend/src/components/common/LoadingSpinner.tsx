import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import './common.css';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <Box className="loading-spinner">
      <CircularProgress />
      <Typography variant="body2" color="text.secondary" className="loading-spinner-text">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
