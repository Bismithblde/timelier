import React from 'react';
import { Box } from '@mui/material';
import TimerList from '../../components/TimerList';

export default function Popup() {
  return (
    <Box
      sx={{
        width: '2000px',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
      }}>
      <TimerList />
    </Box>
  );
}
