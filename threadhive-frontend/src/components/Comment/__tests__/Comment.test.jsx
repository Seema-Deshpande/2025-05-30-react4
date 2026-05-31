import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import CommentList from '../CommentList';
import CommentForm from '../CommentForm';

describe('CommentList Component', () => {
  it('renders with comments data', () => {
    const mockComments = [
      {
        _id: 'comment1',
        content: 'Great thread!',
        author: { _id: 'user1', username: 'testuser' },
        thread: '1',
        upvotes: 5,
        downvotes: 0,
        createdAt: '2026-05-30T11:00:00Z',
      },
      {
        _id: 'comment2',
        content: 'I agree!',
        author: { _id: 'user2', username: 'anotheruser' },
        thread: '1',
        upvotes: 3,
        downvotes: 0,
        createdAt: '2026-05-30T12:00:00Z',
      },
    ];

    renderWithProviders(<CommentList threadId="1" />, {
      preloadedState: {
        comments: {
          comments: mockComments,
          loading: false,
          error: null,
        },
      },
    });

    // Check if comments are rendered
    expect(screen.getByText('Great thread!')).toBeInTheDocument();
    expect(screen.getByText('I agree!')).toBeInTheDocument();
  });

  it('renders comment container', () => {
    renderWithProviders(<CommentList threadId="1" />, {
      preloadedState: {
        comments: {
          comments: [],
          loading: false,
          error: null,
        },
      },
    });

    // Component should render a container div
    const container = document.querySelector('.d-flex.flex-column');
    expect(container).toBeInTheDocument();
  });
});

describe('CommentForm Component', () => {
  it('renders form with textarea', () => {
    renderWithProviders(<CommentForm threadId="1" />);

    expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post comment/i })).toBeInTheDocument();
  });

  it('allows user to type comment', async () => {
    const user = userEvent.setup();

    renderWithProviders(<CommentForm threadId="1" />);

    const textarea = screen.getByPlaceholderText(/write a comment/i);
    await user.type(textarea, 'This is my comment');

    expect(textarea).toHaveValue('This is my comment');
  });

  it('button is disabled when textarea is empty', () => {
    renderWithProviders(<CommentForm threadId="1" />);

    const submitButton = screen.getByRole('button', { name: /post comment/i });

    // Button should be disabled when empty
    expect(submitButton).toHaveAttribute('disabled');
  });

  it('textarea is visible and functional', async () => {
    const user = userEvent.setup();

    renderWithProviders(<CommentForm threadId="1" />);

    const textarea = screen.getByPlaceholderText(/write a comment/i);
    
    // Initially empty
    expect(textarea).toHaveValue('');

    // Can type in it
    await user.type(textarea, 'My comment');
    expect(textarea).toHaveValue('My comment');

    // Can clear it
    await user.clear(textarea);
    expect(textarea).toHaveValue('');
  });
});
