import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './constants/theme';
import AppLayout from './components/layout/AppLayout';
import StudentDashboard from './components/dashboard/StudentDashboard';
import CourseBrowser from './components/courses/CourseBrowser';
import ScheduleBuilder from './components/schedule/ScheduleBuilder';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchStudentProfile } from './store/slices/studentSlice';
import { fetchSchedule } from './store/slices/scheduleSlice';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useAppDispatch();
  const { selectedStudentId } = useAppSelector((state) => state.student);

  // Load student data on student change
  useEffect(() => {
    dispatch(fetchStudentProfile(selectedStudentId));
    dispatch(fetchSchedule(selectedStudentId));
  }, [dispatch, selectedStudentId]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 0:
        return <StudentDashboard />;
      case 1:
        return <CourseBrowser />;
      case 2:
        return <ScheduleBuilder />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderActiveTab()}
      </AppLayout>
    </ThemeProvider>
  );
};

export default App;
