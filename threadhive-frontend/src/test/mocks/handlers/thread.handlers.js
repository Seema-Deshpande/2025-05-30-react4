import { http, HttpResponse } from 'msw';
import { createMockThread, createMockThreads } from '../data/threads.mock.data.js';

const BASE_URL = 'http://localhost:3000/api';

export const threadHandlers = [
  // GET /api/threads - Fetch all threads
  http.get(`${BASE_URL}/threads`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return HttpResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: createMockThreads(5)
    });
  }),

  // GET /api/threads/:id - Fetch thread by ID
  http.get(`${BASE_URL}/threads/:id`, ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return HttpResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (params.id === 'invalid-id') {
      return HttpResponse.json(
        { success: false, message: 'Thread not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: createMockThread({ _id: params.id })
    });
  }),

  // POST /api/threads - Create thread
  http.post(`${BASE_URL}/threads`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return HttpResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    if (!body.title || !body.content) {
      return HttpResponse.json(
        { success: false, message: 'Validation error: title and content are required' },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: createMockThread({
        title: body.title,
        content: body.content,
        subreddit: { _id: body.subreddit }
      })
    }, { status: 201 });
  }),

  // POST /api/threads/:id/upvote - Upvote thread
  http.post(`${BASE_URL}/threads/:id/upvote`, ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return HttpResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (params.id === 'invalid-id') {
      return HttpResponse.json(
        { success: false, message: 'Thread not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: createMockThread({
        _id: params.id,
        voteCount: 11
      })
    });
  }),

  // POST /api/threads/:id/downvote - Downvote thread
  http.post(`${BASE_URL}/threads/:id/downvote`, ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return HttpResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (params.id === 'invalid-id') {
      return HttpResponse.json(
        { success: false, message: 'Thread not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: createMockThread({
        _id: params.id,
        voteCount: 9
      })
    });
  })
];
