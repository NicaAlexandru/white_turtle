import React from 'react';
import { Box, Typography, Pagination, FormControl, Select, MenuItem, InputLabel } from '@mui/material';

interface PaginationBarProps {
  page: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PaginationBar: React.FC<PaginationBarProps> = ({
  page,
  totalPages,
  pageSize,
  pageSizeOptions = [12, 24, 48],
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
      <Typography variant="body2" color="text.secondary">
        Page {page + 1} of {Math.max(totalPages, 1)}
      </Typography>
      <Box display="flex" alignItems="center" gap={2}>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, p) => onPageChange(p - 1)}
            color="primary"
            size="small"
          />
        )}
        <FormControl size="small" style={{ minWidth: 100 }}>
          <InputLabel>Per page</InputLabel>
          <Select
            value={pageSize}
            label="Per page"
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default PaginationBar;
