import React from 'react';
import { Card, CardContent, Box, Typography, Chip, LinearProgress } from '@mui/material';
import './StudentDashboard.css';

interface GraduationProgressProps {
  creditsEarned: number;
  creditsRequired: number;
}

const GraduationProgress: React.FC<GraduationProgressProps> = ({
  creditsEarned,
  creditsRequired,
}) => {
  const progress = Math.min((creditsEarned / creditsRequired) * 100, 100);

  return (
    <Card elevation={2}>
      <CardContent>
        <Box className="graduation-header">
          <Typography variant="subtitle1" fontWeight={600}>
            Graduation Progress
          </Typography>
          <Chip
            label={progress >= 100 ? 'Ready to Graduate!' : `${progress.toFixed(0)}%`}
            color={progress >= 100 ? 'success' : 'default'}
            size="small"
          />
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          className="graduation-progress-bar"
        />
        <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
          {creditsEarned} / {creditsRequired} credits
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GraduationProgress;
