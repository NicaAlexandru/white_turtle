import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SuccessSnackbarProps {
  message: string | null;
  onClose: () => void;
}

const SuccessSnackbar: React.FC<SuccessSnackbarProps> = ({ message, onClose }) => {
  return (
    <Snackbar
      open={!!message}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity="success" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessSnackbar;
