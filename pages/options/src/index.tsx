import { createRoot } from 'react-dom/client';
import '@src/index.css';
import '@extension/ui/dist/global.css';
import Options from '@src/Options';
import { StopwatchProvider } from '../../contexts/stopwatchContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { dark } from '@mui/material/styles/createPalette';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <StopwatchProvider>
        <Options />
      </StopwatchProvider>
    </ThemeProvider>,
  );
}

init();
