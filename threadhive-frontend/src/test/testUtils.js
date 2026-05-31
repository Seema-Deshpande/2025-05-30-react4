import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../store/store';

/**
 * Custom render function that wraps components with Redux Provider and Router
 */
export function renderWithProviders(component) {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
}

export * from '@testing-library/react';
