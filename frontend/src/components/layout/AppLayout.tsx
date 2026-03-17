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
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <SchoolIcon className="app-toolbar-icon" />
          <Typography variant="h6" component="div" className="app-toolbar-title">
            Maplewood High School
          </Typography>
          <TextField
            size="small"
            label="Student ID"
            value={studentIdInput}
            onChange={(e) => setStudentIdInput(e.target.value)}
            onKeyDown={handleStudentIdChange}
            className="student-id-input"
          />
        </Toolbar>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => onTabChange(newValue)}
          textColor="inherit"
          indicatorColor="secondary"
          className="app-tabs"
        >
          <Tab label="Dashboard" />
          <Tab label="Course Browser" />
          <Tab label="Schedule Builder" />
        </Tabs>
      </AppBar>
      <Container maxWidth="xl" className="app-content">
        {children}
      </Container>
    </Box>
  );
};

export default AppLayout;
