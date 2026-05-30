export const createMockComment = (overrides = {}) => ({
  _id: '607f1f77bcf86cd799439001',
  thread: '507f1f77bcf86cd799439011',
  author: {
    _id: '507f1f77bcf86cd799439014',
    username: 'jane_dev',
    email: 'jane@example.com'
  },
  content: 'Great tips! Especially loved the memoization section.',
  voteCount: 12,
  upvotes: ['user1', 'user4'],
  downvotes: [],
  createdAt: '2026-05-30T11:00:00Z',
  updatedAt: '2026-05-30T11:00:00Z',
  ...overrides
});

export const createMockComments = (count = 3, overrides = {}) => {
  return Array.from({ length: count }, (_, i) =>
    createMockComment({
      _id: `607f1f77bcf86cd79943900${i}`,
      content: `Comment ${i + 1}`,
      voteCount: 5 + i * 2,
      ...overrides
    })
  );
};

export const MOCK_COMMENTS = createMockComments(3);

export const commentWithThreadId = (threadId) =>
  createMockComment({ thread: threadId });

export const commentNotFound = () => ({
  success: false,
  message: 'Comment not found'
});

export const commentValidationError = () => ({
  success: false,
  message: 'Validation error: content is required'
});
