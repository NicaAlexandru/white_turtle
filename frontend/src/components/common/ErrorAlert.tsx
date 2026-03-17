import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import './common.css';

interface ErrorAlertProps {
  title?: string;
  message: string;
  severity?: 'error' | 'warning' | 'info';
  onClose?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Error',
  message,
  severity = 'error',
  onClose,
}) => {
  return (
    <Alert severity={severity} onClose={onClose} className="error-alert">
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
};

export default ErrorAlert;
