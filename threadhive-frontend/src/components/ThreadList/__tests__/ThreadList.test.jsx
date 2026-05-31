import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import ThreadList from '../ThreadList';

describe('ThreadList Component', () => {
  it('renders threads when data is provided', () => {
    const mockThreads = [
      {
        _id: '1',
        title: 'Test Thread 1',
        content: 'This is test thread 1',
        author: { _id: 'user1', username: 'testuser' },
        subreddit: 'javascript',
        voteCount: 10,
        commentCount: 3,
        createdAt: '2026-05-30T10:00:00Z',
      },
      {
        _id: '2',
        title: 'Test Thread 2',
        content: 'This is test thread 2',
        author: { _id: 'user2', username: 'anotheruser' },
        subreddit: 'react',
        voteCount: 15,
        commentCount: 5,
        createdAt: '2026-05-29T10:00:00Z',
      },
    ];

    renderWithProviders(<ThreadList threadsToDisplay={mockThreads} />);

    // Check if threads are rendered
    expect(screen.getByText('Test Thread 1')).toBeInTheDocument();
    expect(screen.getByText('Test Thread 2')).toBeInTheDocument();
  });

  it('renders empty state when no threads provided', () => {
    renderWithProviders(<ThreadList threadsToDisplay={[]} />);

    // Empty thread list
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list.children.length).toBe(0);
  });

  it('displays thread titles', () => {
    const mockThreads = [
      {
        _id: '1',
        title: 'Amazing Discussion',
        content: 'Check this out',
        author: { _id: 'user1', username: 'johndoe' },
        subreddit: 'javascript',
        voteCount: 5,
        commentCount: 2,
        createdAt: '2026-05-30T10:00:00Z',
      },
    ];

    renderWithProviders(<ThreadList threadsToDisplay={mockThreads} />);

    // Check thread title is rendered
    expect(screen.getByText('Amazing Discussion')).toBeInTheDocument();
    // Check thread content is rendered
    expect(screen.getByText('Check this out')).toBeInTheDocument();
  });
});
