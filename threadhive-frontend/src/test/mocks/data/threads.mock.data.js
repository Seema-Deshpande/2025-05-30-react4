export const createMockThread = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439011',
  title: 'React Performance Tips',
  content: 'Here are some tips for optimizing React apps...',
  subreddit: {
    _id: '507f1f77bcf86cd799439012',
    name: 'reactjs',
    description: 'React discussion community'
  },
  author: {
    _id: '507f1f77bcf86cd799439013',
    username: 'john_dev',
    email: 'john@example.com'
  },
  voteCount: 42,
  upvotes: ['user1', 'user2'],
  downvotes: [],
  commentCount: 5,
  createdAt: '2026-05-30T10:00:00Z',
  updatedAt: '2026-05-30T15:30:00Z',
  ...overrides
});

export const createMockThreads = (count = 3, overrides = {}) => {
  return Array.from({ length: count }, (_, i) =>
    createMockThread({
      _id: `507f1f77bcf86cd79943901${i}`,
      title: `Thread ${i + 1}`,
      voteCount: 10 + i * 5,
      ...overrides
    })
  );
};

export const MOCK_THREADS = createMockThreads(5);

export const threadWithVoteCount = (count) =>
  createMockThread({ voteCount: count });

export const threadNotFound = () => ({
  success: false,
  message: 'Thread not found'
});

export const threadValidationError = () => ({
  success: false,
  message: 'Validation error: title and content are required'
});
