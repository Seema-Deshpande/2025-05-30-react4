import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../reducers/authSlice.js';
import threadReducer from '../../reducers/threadListSlice.js';
import currentThreadReducer from '../../reducers/currentThreadSlice.js';
import commentReducer from '../../reducers/commentSlice.js';
import themeReducer from '../../reducers/themeSlice.js';
import subredditReducer from '../../reducers/subredditSlice.js';

export function renderWithRedux(component, { initialState, store = null } = {}) {
  const testStore = store || configureStore({
    reducer: {
      auth: authReducer,
      threads: threadReducer,
      currentThread: currentThreadReducer,
      comments: commentReducer,
      theme: themeReducer,
      subreddits: subredditReducer
    },
    preloadedState: initialState
  });

  return {
    ...render(<Provider store={testStore}>{component}</Provider>),
    store: testStore
  };
}

export * from '@testing-library/react';
