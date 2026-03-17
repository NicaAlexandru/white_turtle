import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import './CourseCard.css';

interface CourseFiltersProps {
  grade?: number;
  semester?: number;
  onGradeChange: (grade?: number) => void;
  onSemesterChange: (semester?: number) => void;
  onClear: () => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  grade,
  semester,
  onGradeChange,
  onSemesterChange,
  onClear,
}) => {
  return (
    <Box display="flex" alignItems="center" gap={2} mb={3} flexWrap="wrap">
      <FilterListIcon color="action" />

      <FormControl size="small" className="filter-select">
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

      <FormControl size="small" className="filter-select">
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

      {(grade !== undefined || semester !== undefined) && (
        <Button size="small" startIcon={<ClearIcon />} onClick={onClear}>
          Clear
        </Button>
      )}
    </Box>
  );
};

export default CourseFilters;
