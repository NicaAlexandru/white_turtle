import React from 'react';
import {
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import './StudentDashboard.css';
import { CourseHistory as CourseHistoryType } from '../../types';

interface CourseHistoryProps {
  history: CourseHistoryType[];
}

const CourseHistory: React.FC<CourseHistoryProps> = ({ history }) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Course History
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell><strong>Course Name</strong></TableCell>
                <TableCell><strong>Credits</strong></TableCell>
                <TableCell><strong>Semester</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((record) => (
                <TableRow key={`${record.courseId}-${record.semesterName}`} hover>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {record.courseCode}
                    </Typography>
                  </TableCell>
                  <TableCell>{record.courseName}</TableCell>
                  <TableCell>{record.credits}</TableCell>
                  <TableCell>{record.semesterName}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      color={record.status === 'passed' ? 'success' : 'error'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box className="empty-history">
                      <HistoryIcon className="empty-history-icon" />
                      <Typography variant="body2" color="text.secondary">
                        No course history yet
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Completed courses will appear here
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default CourseHistory;
