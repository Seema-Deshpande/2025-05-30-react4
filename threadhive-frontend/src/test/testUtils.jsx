import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authSlice';
import threadListReducer from '../reducers/threadListSlice';
import currentThreadReducer from '../reducers/currentThreadSlice';
import commentReducer from '../reducers/commentSlice';
import subredditReducer from '../reducers/subredditSlice';
import themeReducer from '../reducers/themeSlice';

/**
 * Create a test store with optional preloaded state
 */
function createTestStore(preloadedState) {
  return configureStore({
    reducer: {
      auth: authReducer,
      threads: threadListReducer,
      currentThread: currentThreadReducer,
      comments: commentReducer,
      subreddits: subredditReducer,
      theme: themeReducer,
    },
    preloadedState,
  });
}

/**
 * Custom render function that wraps components with Redux Provider and Router
 */
export function renderWithProviders(component, { preloadedState } = {}) {
  const store = createTestStore(preloadedState);

  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
}

export * from '@testing-library/react';

