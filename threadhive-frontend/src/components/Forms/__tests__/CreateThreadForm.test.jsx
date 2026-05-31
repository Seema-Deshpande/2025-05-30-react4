import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import CreateThreadForm from '../CreateThreadForm';

describe('CreateThreadForm Component', () => {
  it('renders form with input fields', () => {
    renderWithProviders(<CreateThreadForm />, {
      preloadedState: {
        auth: {
          token: 'mock-token',
          user: { _id: 'user1', username: 'testuser' },
          loading: false,
          error: null,
        },
      },
    });

    expect(screen.getByLabelText(/thread title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/community/i)).toBeInTheDocument();
  });

  it('allows user to fill in form fields', async () => {
    const user = userEvent.setup();

    renderWithProviders(<CreateThreadForm />, {
      preloadedState: {
        auth: {
          token: 'mock-token',
          user: { _id: 'user1', username: 'testuser' },
          loading: false,
          error: null,
        },
      },
    });

    const titleInput = screen.getByLabelText(/thread title/i);
    const contentInput = screen.getByLabelText(/content/i);

    await user.type(titleInput, 'New Thread Title');
    await user.type(contentInput, 'This is the content of the new thread');

    expect(titleInput).toHaveValue('New Thread Title');
    expect(contentInput).toHaveValue('This is the content of the new thread');
  });

  it('has a submit button', () => {
    renderWithProviders(<CreateThreadForm />, {
      preloadedState: {
        auth: {
          token: 'mock-token',
          user: { _id: 'user1', username: 'testuser' },
          loading: false,
          error: null,
        },
      },
    });

    const submitButton = screen.getByRole('button', { name: /post thread/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('renders community selector', () => {
    renderWithProviders(<CreateThreadForm />, {
      preloadedState: {
        auth: {
          token: 'mock-token',
          user: { _id: 'user1', username: 'testuser' },
          loading: false,
          error: null,
        },
      },
    });

    // Check for community label
    expect(screen.getByLabelText(/community/i)).toBeInTheDocument();
  });
});
