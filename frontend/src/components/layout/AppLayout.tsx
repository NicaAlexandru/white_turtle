import React, { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Tabs, Tab, Container, TextField } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedStudentId } from '../../store/slices/studentSlice';
import './AppLayout.css';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: number;
  onTabChange: (tab: number) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const dispatch = useAppDispatch();
  const selectedStudentId = useAppSelector((state) => state.student.selectedStudentId);
  const [studentIdInput, setStudentIdInput] = useState(String(selectedStudentId));

  const handleStudentIdChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const id = parseInt(studentIdInput, 10);
      if (id > 0) {
        dispatch(setSelectedStudentId(id));
      }
    }
  };

  return (
    <Box className="app-root">
      <AppBar position="static" elevation={0} className="app-bar">
        <Toolbar variant="dense">
          <SchoolIcon className="app-toolbar-icon" fontSize="small" />
          <Typography variant="subtitle1" component="div" className="app-toolbar-title">
            Maplewood High School
          </Typography>
          <Box className="student-id-wrapper">
            <Typography variant="caption" className="student-id-label">
              Student ID
            </Typography>
            <TextField
              size="small"
              variant="outlined"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
              onKeyDown={handleStudentIdChange}
              className="student-id-input"
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Box className="app-tabs-bar">
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => onTabChange(newValue)}
          textColor="primary"
          indicatorColor="primary"
          className="app-tabs"
        >
          <Tab label="Dashboard" />
          <Tab label="Course Browser" />
          <Tab label="Schedule Builder" />
        </Tabs>
      </Box>
      <Container maxWidth="xl" className="app-content">
        {children}
      </Container>
    </Box>
  );
};

export default AppLayout;
