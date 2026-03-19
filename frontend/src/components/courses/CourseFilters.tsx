import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Button, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface CourseFiltersProps {
  grade?: number;
  semester?: number;
  search: string;
  onGradeChange: (grade?: number) => void;
  onSemesterChange: (semester?: number) => void;
  onSearchChange: (search: string) => void;
  onClear: () => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  grade,
  semester,
  search,
  onGradeChange,
  onSemesterChange,
  onSearchChange,
  onClear,
}) => {
  const hasActiveFilters = grade !== undefined || semester !== undefined || search.length > 0;

  return (
    <Box display="flex" alignItems="center" gap={2} mb={3} flexWrap="wrap">
      <TextField
        size="small"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ minWidth: 240 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      <FormControl size="small" style={{ minWidth: 200 }}>
        <InputLabel>Grade Level</InputLabel>
        <Select
          value={grade ?? ''}
          label="Grade Level"
          onChange={(e) => {
            const val = e.target.value;
            onGradeChange(val === '' ? undefined : Number(val));
          }}
        >
          <MenuItem value="">All Grades</MenuItem>
          <MenuItem value={9}>Grade 9</MenuItem>
          <MenuItem value={10}>Grade 10</MenuItem>
          <MenuItem value={11}>Grade 11</MenuItem>
          <MenuItem value={12}>Grade 12</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" style={{ minWidth: 200 }}>
        <InputLabel>Semester</InputLabel>
        <Select
          value={semester ?? ''}
          label="Semester"
          onChange={(e) => {
            const val = e.target.value;
            onSemesterChange(val === '' ? undefined : Number(val));
          }}
        >
          <MenuItem value="">All Semesters</MenuItem>
          <MenuItem value={1}>Fall</MenuItem>
          <MenuItem value={2}>Spring</MenuItem>
        </Select>
      </FormControl>

      {hasActiveFilters && (
        <Button size="small" startIcon={<ClearIcon />} onClick={onClear}>
          Clear
        </Button>
      )}
    </Box>
  );
};

export default CourseFilters;
