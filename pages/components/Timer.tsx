import { Box, Typography, Button } from '@mui/material';
import React, { useState } from 'react';

interface StopwatchType {
  name?: string;
  link?: string;
  time?: string;
}

interface TimerProps {
  stopwatch: StopwatchType;
}

const Timer: React.FC<TimerProps> = ({ stopwatch }) => {
  const [tabInfo, setTabInfo] = useState({ name: '', url: '' });

  const handleClick = () => {
    // Uncomment and implement the logic here
    /* chrome.runtime.sendMessage({}, response => {
      if (response && response.tabName) {
        setTabInfo({
          name: response.tabName,
          url: response.tabUrl || '',
        });
      } else if (response && response.error) {
        console.error(response.error);
      }
    }); */
  };

  return (
    <Box sx={{ ml: 10, mr: 10, mt: 5, mb: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: '40px',
          backgroundColor: theme => theme.palette.secondary.dark,
          padding: 2,
          minWidth: '400px',
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
          }}>
          <Typography variant="h5">{stopwatch.name}</Typography>
          <Typography variant="h5" sx={{ mt: 1 }}>
            {stopwatch.time}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleClick}>
            Add
          </Button>
        </Box>
        {tabInfo.name && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6">Tab Name: {tabInfo.name}</Typography>
            <Typography variant="body2">URL: {tabInfo.url}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Timer;
