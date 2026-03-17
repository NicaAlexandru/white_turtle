import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import './StudentDashboard.css';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  valueColor?: string;
  caption?: string;
  extra?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  valueColor = 'primary.main',
  caption,
  extra,
}) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box className="stat-card-header">
          {icon}
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
        </Box>
        <Box className="stat-card-value-row">
          <Typography variant="h3" fontWeight={700} color={valueColor}>
            {value}
          </Typography>
          {extra}
        </Box>
        {caption && (
          <Typography variant="caption" color="text.secondary">
            {caption}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
