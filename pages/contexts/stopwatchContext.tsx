import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';

const ADD_STOPWATCH = 'ADD_STOPWATCH';
const REMOVE_STOPWATCH = 'REMOVE_STOPWATCH';

// Define your types
interface Stopwatch {
  name: string;
  link: string;
  time: number;
  lastCurrentTime: number;
}

interface StopwatchState {
  stopwatches: Stopwatch[];
}

interface StopwatchContextType {
  stopwatches: Stopwatch[];
  addStopwatch: (stopwatch: Stopwatch) => Promise<void>;
  removeStopwatch: (link: string) => Promise<void>;
}

const stopwatchReducer = (state: StopwatchState, action: any): StopwatchState => {
  switch (action.type) {
    case ADD_STOPWATCH:
      return {
        stopwatches: [...state.stopwatches, action.payload],
      };
    case REMOVE_STOPWATCH:
      return {
        stopwatches: state.stopwatches.filter(stopwatch => stopwatch.link !== action.payload.link),
      };
    default:
      return state;
  }
};

// Create context with default value
const StopwatchContext = createContext<StopwatchContextType | undefined>(undefined);

export const StopwatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(stopwatchReducer, { stopwatches: [] });

  const addStopwatch = async (stopwatch: Stopwatch) => {
    // Check if stopwatch already exists in the state to prevent duplicates
    if (state.stopwatches.find(existing => existing.link === stopwatch.link)) {
      return; // If it exists, do not proceed
    }

    dispatch({ type: ADD_STOPWATCH, payload: stopwatch });

    const result = await chrome.storage.local.get('stopwatches');
    const updatedStopwatches = [...(result.stopwatches || []), stopwatch];
    await chrome.storage.local.set({ stopwatches: updatedStopwatches });
  };

  const removeStopwatch = async (link: string) => {
    dispatch({ type: REMOVE_STOPWATCH, payload: { link } });

    const result = await chrome.storage.local.get('stopwatches');
    const updatedStopwatches = (result.stopwatches || []).filter((sw: Stopwatch) => sw.link !== link);
    await chrome.storage.local.set({ stopwatches: updatedStopwatches });
  };

  useEffect(() => {
    const getStopwatches = async () => {
      const result = await chrome.storage.local.get('stopwatches');
      if (result.stopwatches) {
        const existingLinks = new Set(state.stopwatches.map(sw => sw.link));
        result.stopwatches.forEach((stopwatch: Stopwatch) => {
          // Only dispatch if it doesn't already exist
          if (!existingLinks.has(stopwatch.link)) {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);

            const offset = currentTimeInSeconds - stopwatch.lastCurrentTime;
            const newStopwatch = { ...stopwatch, time: stopwatch.time + offset };
            dispatch({ type: ADD_STOPWATCH, payload: newStopwatch });
          }
        });
      }
    };

    // Fetch the stopwatches on component mount
    getStopwatches();

    const handleStorageChange = (changes: any, namespace: string) => {
      if (namespace === 'local' && changes.stopwatches) {
        const newStopwatches = changes.stopwatches.newValue || [];
        const existingLinks = new Set(state.stopwatches.map(sw => sw.link)); // Track existing links

        // Add only non-existing stopwatches
        newStopwatches.forEach((sw: Stopwatch) => {
          if (!existingLinks.has(sw.link)) {
            dispatch({ type: ADD_STOPWATCH, payload: sw });
          }
        });

        // Remove stopwatches that are no longer present
        state.stopwatches.forEach(sw => {
          if (!newStopwatches.find((newSw: Stopwatch) => newSw.link === sw.link)) {
            dispatch({ type: REMOVE_STOPWATCH, payload: { link: sw.link } });
          }
        });
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [state.stopwatches]); // Added state.stopwatches to dependencies

  return (
    <StopwatchContext.Provider
      value={{
        stopwatches: state.stopwatches,
        addStopwatch,
        removeStopwatch,
      }}>
      {children}
    </StopwatchContext.Provider>
  );
};

// Custom hook to use the context
export const useStopwatch = () => {
  const context = useContext(StopwatchContext);
  if (!context) {
    throw new Error('useStopwatch must be used within a StopwatchProvider');
  }
  return context;
};
