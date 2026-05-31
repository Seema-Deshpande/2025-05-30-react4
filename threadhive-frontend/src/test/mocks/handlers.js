import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:3000/api';

// Mock data
const mockThreads = [
  {
    _id: '1',
    title: 'Test Thread 1',
    content: 'This is test thread 1',
    author: { _id: 'user1', username: 'testuser' },
    subreddit: 'javascript',
    upvotes: 10,
    downvotes: 2,
    commentCount: 3,
    createdAt: '2026-05-30T10:00:00Z',
  },
  {
    _id: '2',
    title: 'Test Thread 2',
    content: 'This is test thread 2',
    author: { _id: 'user2', username: 'anotheruser' },
    subreddit: 'react',
    upvotes: 15,
    downvotes: 1,
    commentCount: 5,
    createdAt: '2026-05-29T10:00:00Z',
  },
];

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

const mockUser = {
  _id: 'user1',
  username: 'testuser',
  email: 'test@example.com',
};

const mockToken = 'mock-jwt-token-123';

export const handlers = [
  // Auth handlers
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = await request.json();
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json(
        {
          data: {
            token: mockToken,
            user: mockUser,
          },
        },
        { status: 200 }
      );
    }
    return HttpResponse.json(
      { data: { error: 'Invalid credentials' } },
      { status: 401 }
    );
  }),

  http.post(`${API_BASE}/auth/register`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        data: {
          token: mockToken,
          user: { ...mockUser, username: body.username, email: body.email },
        },
      },
      { status: 201 }
    );
  }),

  // Thread handlers
  http.get(`${API_BASE}/threads`, () => {
    return HttpResponse.json(
      {
        data: {
          threads: mockThreads,
          total: mockThreads.length,
        },
      },
      { status: 200 }
    );
  }),

  http.get(`${API_BASE}/threads/:id`, ({ params }) => {
    const thread = mockThreads.find((t) => t._id === params.id);
    if (thread) {
      return HttpResponse.json({ data: thread }, { status: 200 });
    }
    return HttpResponse.json(
      { data: { error: 'Thread not found' } },
      { status: 404 }
    );
  }),

  http.post(`${API_BASE}/threads`, async ({ request }) => {
    const body = await request.json();
    const newThread = {
      _id: `thread-${Date.now()}`,
      ...body,
      author: mockUser,
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json({ data: newThread }, { status: 201 });
  }),

  http.post(`${API_BASE}/threads/:id/upvote`, ({ params }) => {
    const thread = mockThreads.find((t) => t._id === params.id);
    if (thread) {
      return HttpResponse.json(
        {
          data: {
            ...thread,
            upvotes: thread.upvotes + 1,
          },
        },
        { status: 200 }
      );
    }
    return HttpResponse.json(
      { data: { error: 'Thread not found' } },
      { status: 404 }
    );
  }),

  http.post(`${API_BASE}/threads/:id/downvote`, ({ params }) => {
    const thread = mockThreads.find((t) => t._id === params.id);
    if (thread) {
      return HttpResponse.json(
        {
          data: {
            ...thread,
            downvotes: thread.downvotes + 1,
          },
        },
        { status: 200 }
      );
    }
    return HttpResponse.json(
      { data: { error: 'Thread not found' } },
      { status: 404 }
    );
  }),

  // Comment handlers
  http.get(`${API_BASE}/comments/thread/:threadId`, ({ params }) => {
    const threadComments = mockComments.filter(
      (c) => c.thread === params.threadId
    );
    return HttpResponse.json(
      {
        data: {
          comments: threadComments,
          total: threadComments.length,
        },
      },
      { status: 200 }
    );
  }),

  http.post(`${API_BASE}/comments`, async ({ request }) => {
    const body = await request.json();
    const newComment = {
      _id: `comment-${Date.now()}`,
      ...body,
      author: mockUser,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json({ data: newComment }, { status: 201 });
  }),

  http.post(`${API_BASE}/comments/:id/upvote`, ({ params }) => {
    const comment = mockComments.find((c) => c._id === params.id);
    if (comment) {
      return HttpResponse.json(
        {
          data: {
            ...comment,
            upvotes: comment.upvotes + 1,
          },
        },
        { status: 200 }
      );
    }
    return HttpResponse.json(
      { data: { error: 'Comment not found' } },
      { status: 404 }
    );
  }),

  http.post(`${API_BASE}/comments/:id/downvote`, ({ params }) => {
    const comment = mockComments.find((c) => c._id === params.id);
    if (comment) {
      return HttpResponse.json(
        {
          data: {
            ...comment,
            downvotes: comment.downvotes + 1,
          },
        },
        { status: 200 }
      );
    }
    return HttpResponse.json(
      { data: { error: 'Comment not found' } },
      { status: 404 }
    );
  }),

  // Subreddit handlers
  http.get(`${API_BASE}/subreddits`, () => {
    return HttpResponse.json(
      {
        data: {
          subreddits: [
            { _id: 'sub1', name: 'javascript' },
            { _id: 'sub2', name: 'react' },
          ],
        },
      },
      { status: 200 }
    );
  }),

  // User handlers
  http.get(`${API_BASE}/users/profile`, () => {
    return HttpResponse.json({ data: mockUser }, { status: 200 });
  }),
];
