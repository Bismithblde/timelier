import { Box, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useStopwatch } from '../contexts/stopwatchContext';

interface StopwatchType {
  name: string;
  link: string;
  time: number;
  lastCurrentTime: number;
}

interface TimerProps {
  stopwatch: StopwatchType;
}

const Timer: React.FC<TimerProps> = ({ stopwatch }) => {
  const [tabInfo, setTabInfo] = useState({ name: '', url: '' });
  const { stopwatches } = useStopwatch();
  const [localTime, setLocalTime] = useState(stopwatch.time);

  useEffect(() => {
    const updatedStopwatch = stopwatches.find(sw => sw.link === stopwatch.link);
    if (updatedStopwatch) {
      setLocalTime(updatedStopwatch.time);
    }
  }, [stopwatches, stopwatch.link]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLocalTime(prevTime => {
        const newTime = prevTime + 1;
        updateStopwatchTime(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const updateStopwatchTime = (newTime: number) => {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    chrome.storage.local.get('stopwatches', result => {
      const stopwatches = result.stopwatches || [];
      const updatedStopwatches = stopwatches.map((element: StopwatchType) => {
        if (element.link === stopwatch.link) {
          return { ...element, time: newTime, lastCurrentTime: currentTimeInSeconds };
        }
        return element;
      });

      chrome.storage.local.set({ stopwatches: updatedStopwatches }, () => {
        console.log('Stopwatches updated successfully.');
      });
    });
  };

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
            {String(Math.floor(localTime / 3600)).padStart(2, '0')}:
            {String(Math.floor((localTime % 3600) / 60)).padStart(2, '0')}:{String(localTime % 60).padStart(2, '0')}{' '}
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
