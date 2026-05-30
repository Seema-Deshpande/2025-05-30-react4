import { http, HttpResponse } from 'msw';
import { createMockComment, createMockComments } from '../data/comments.mock.data.js';

const BASE_URL = 'http://localhost:3000/api';

export const commentHandlers = [
  // GET /api/comments/thread/:threadId - Fetch comments for thread
  http.get(`${BASE_URL}/comments/thread/:threadId`, ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return HttpResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (params.threadId === 'invalid-thread-id') {
      return HttpResponse.json(
        { success: false, message: 'Thread not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: createMockComments(3, { thread: params.threadId })
    });
  }),

  // POST /api/comments - Create comment
  http.post(`${BASE_URL}/comments`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return HttpResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    if (!body.content) {
      return HttpResponse.json(
        { success: false, message: 'Validation error: content is required' },
        { status: 400 }
      );
    }

    if (body.thread === 'invalid-thread-id') {
      return HttpResponse.json(
        { success: false, message: 'Thread not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: createMockComment({
        thread: body.thread,
        content: body.content
      })
    }, { status: 201 });
  }),

  // POST /api/comments/:id/upvote - Upvote comment
  http.post(`${BASE_URL}/comments/:id/upvote`, ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return HttpResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (params.id === 'invalid-comment-id') {
      return HttpResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: createMockComment({
        _id: params.id,
        voteCount: 6
      })
    });
  }),

  // POST /api/comments/:id/downvote - Downvote comment
  http.post(`${BASE_URL}/comments/:id/downvote`, ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return HttpResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (params.id === 'invalid-comment-id') {
      return HttpResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: createMockComment({
        _id: params.id,
        voteCount: 4
      })
    });
  })
];
