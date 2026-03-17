import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { ScheduleEntry } from '../../types';

interface DropConfirmDialogProps {
  entry: ScheduleEntry | undefined;
  open: boolean;
  dropping: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DropConfirmDialog: React.FC<DropConfirmDialogProps> = ({
  entry,
  open,
  dropping,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Drop Course?</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to drop{' '}
          <strong>
            {entry?.courseCode} - {entry?.courseName}
          </strong>
          ?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={dropping}>
          {dropping ? 'Dropping...' : 'Drop Course'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DropConfirmDialog;
