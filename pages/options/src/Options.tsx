import React, { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useStopwatch } from '../../contexts/stopwatchContext';

interface Stopwatch {
  name: string;
  link: string;
  time: string;
}

export default function Options() {
  const [name, setName] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const { addStopwatch } = useStopwatch(); // Assuming addStopwatch is defined in your context

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Added ' + name);
    console.log('Link: ' + link);

    const newStopwatch: Stopwatch = { name: name, link: link, time: '0:00' };

    chrome.storage.local.get('stopwatches', result => {
      const existingStopwatches: Stopwatch[] = result.stopwatches || [];
      const updatedStopwatches = [...existingStopwatches, newStopwatch];
      chrome.storage.local.set({ stopwatches: updatedStopwatches }, () => {
        console.log('Value is set');
      });
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'background.default', // Use MUI theme colors for dark mode
        color: 'text.primary',
        p: 2,
      }}>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderRadius: 2,
          width: '100%',
          maxWidth: 400,
        }}>
        <Typography variant="h4" gutterBottom>
          Add Stopwatch
        </Typography>

        <form onSubmit={onSubmit}>
          {' '}
          {/* Attach the onSubmit handler to the form */}
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Stopwatch Name"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
              }}
            />
            <TextField
              label="Link"
              variant="outlined"
              fullWidth
              value={link}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLink(e.target.value);
              }}
            />
          </Box>
          <Button
            type="submit" // Change button type to submit
            variant="contained"
            color="primary"
            sx={{
              marginTop: 2,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}>
            Submit
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
