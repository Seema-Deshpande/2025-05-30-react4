import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../reducers/authSlice.js';
import threadReducer from '../../reducers/threadListSlice.js';
import currentThreadReducer from '../../reducers/currentThreadSlice.js';
import commentReducer from '../../reducers/commentSlice.js';
import themeReducer from '../../reducers/themeSlice.js';
import subredditReducer from '../../reducers/subredditSlice.js';
import {
  fetchComments,
  addComment,
  upvoteCommentThunk,
  downvoteCommentThunk,
  clearComments
} from '../../reducers/commentSlice.js';
import { setAuthToken, clearAuthToken, resetLocalStorage } from '../utils/test-helpers.js';
import { server } from '../mocks/server.js';
import { http, HttpResponse } from 'msw';

let store;

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      threads: threadReducer,
      currentThread: currentThreadReducer,
      comments: commentReducer,
      theme: themeReducer,
      subreddits: subredditReducer
    }
  });
};

describe('Comment Flow Integration Tests', () => {
  beforeEach(() => {
    store = createTestStore();
    setAuthToken('valid-token');
    vi.mocked(localStorage.getItem).mockReturnValue('valid-token');
  });

  afterEach(() => {
    clearAuthToken();
    resetLocalStorage();
    server.resetHandlers();
  });

  describe('Fetch Comments for Thread', () => {
    it('should fetch all comments for a thread', async () => {
      const threadId = '507f1f77bcf86cd799439011';

      await store.dispatch(fetchComments(threadId));

      const state = store.getState();
      expect(state.comments.comments).toHaveLength(3);
      expect(state.comments.loading).toBe(false);
      expect(state.comments.error).toBeNull();
      expect(state.comments.comments[0]).toHaveProperty('_id');
      expect(state.comments.comments[0]).toHaveProperty('content');
      expect(state.comments.comments[0].thread).toBe(threadId);
    });

    it('should handle thread with no comments', async () => {
      server.use(
        http.get('http://localhost:3000/api/comments/thread/:threadId', () => {
          return HttpResponse.json({
            success: true,
            data: []
          });
        })
      );

      await store.dispatch(fetchComments('507f1f77bcf86cd799439011'));

      const state = store.getState();
      expect(state.comments.comments).toHaveLength(0);
      expect(state.comments.loading).toBe(false);
      expect(state.comments.error).toBeNull();
    });

    it('should handle fetch comments for non-existent thread', async () => {
      await store.dispatch(fetchComments('invalid-thread-id'));

      const state = store.getState();
      expect(state.comments.error).toBeTruthy();
      expect(state.comments.comments).toHaveLength(0);
      expect(state.comments.loading).toBe(false);
    });
  });

  describe('Add Comment', () => {
    it('should add new comment to existing thread', async () => {
      await store.dispatch(fetchComments('507f1f77bcf86cd799439011'));
      expect(store.getState().comments.comments).toHaveLength(3);

      await store.dispatch(addComment({
        threadId: '507f1f77bcf86cd799439011',
        content: 'This is a great discussion!'
      }));

      const state = store.getState();
      expect(state.comments.comments).toHaveLength(4);
      expect(state.comments.comments[3].content).toBe('This is a great discussion!');
      expect(state.comments.loading).toBe(false);
      expect(state.comments.error).toBeNull();
    });

    it('should handle comment validation error', async () => {
      const initialLength = store.getState().comments.comments.length;

      await store.dispatch(addComment({
        threadId: '507f1f77bcf86cd799439011',
        content: ''
      }));

      const state = store.getState();
      expect(state.comments.error).toBeTruthy();
      expect(state.comments.comments).toHaveLength(initialLength);
    });

    it('should handle adding comment to non-existent thread', async () => {
      await store.dispatch(addComment({
        threadId: 'invalid-thread-id',
        content: 'Comment text'
      }));

      const state = store.getState();
      expect(state.comments.error).toBeTruthy();
    });
  });

  describe('Upvote Comment', () => {
    it('should upvote comment and update vote count', async () => {
      await store.dispatch(fetchComments('507f1f77bcf86cd799439011'));
      const commentId = store.getState().comments.comments[0]._id;

      await store.dispatch(upvoteCommentThunk(commentId));

      const updatedComment = store.getState().comments.comments[0];
      expect(updatedComment.voteCount).toBe(6);
    });

    it('should increment vote count from upvote', async () => {
      await store.dispatch(fetchComments('507f1f77bcf86cd799439011'));
      const initialVoteCount = store.getState().comments.comments[0].voteCount;

      await store.dispatch(upvoteCommentThunk(store.getState().comments.comments[0]._id));

      expect(store.getState().comments.comments[0].voteCount).toBeGreaterThan(initialVoteCount);
    });
  });

  describe('Downvote Comment', () => {
    it('should downvote comment and update vote count', async () => {
      await store.dispatch(fetchComments('507f1f77bcf86cd799439011'));
      const commentId = store.getState().comments.comments[0]._id;

      await store.dispatch(downvoteCommentThunk(commentId));

      const updatedComment = store.getState().comments.comments[0];
      expect(updatedComment.voteCount).toBe(4);
    });

    it('should decrement vote count from downvote', async () => {
      await store.dispatch(fetchComments('507f1f77bcf86cd799439011'));
      const initialVoteCount = store.getState().comments.comments[0].voteCount;

      await store.dispatch(downvoteCommentThunk(store.getState().comments.comments[0]._id));

      expect(store.getState().comments.comments[0].voteCount).toBeLessThan(initialVoteCount);
    });
  });

  describe('Clear Comments', () => {
    it('should clear comments state', async () => {
      await store.dispatch(fetchComments('507f1f77bcf86cd799439011'));
      expect(store.getState().comments.comments).toHaveLength(3);

      store.dispatch(clearComments());

      const state = store.getState();
      expect(state.comments.comments).toHaveLength(0);
      expect(state.comments.loading).toBe(false);
      expect(state.comments.error).toBeNull();
    });
  });
});
