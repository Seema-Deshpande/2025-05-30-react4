import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../reducers/authSlice.js';
import threadReducer from '../../reducers/threadListSlice.js';
import currentThreadReducer from '../../reducers/currentThreadSlice.js';
import commentReducer from '../../reducers/commentSlice.js';
import themeReducer from '../../reducers/themeSlice.js';
import subredditReducer from '../../reducers/subredditSlice.js';
import {
  fetchThreads,
  createThreadThunk,
  upvoteThreadThunk,
  downvoteThreadThunk
} from '../../reducers/threadListSlice.js';
import { fetchThreadById } from '../../reducers/currentThreadSlice.js';
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

describe('Thread Flow Integration Tests', () => {
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

  describe('Fetch Recent Threads', () => {
    it('should fetch and display recent threads successfully', async () => {
      await store.dispatch(fetchThreads());

      const state = store.getState();
      expect(state.threads.threads).toHaveLength(5);
      expect(state.threads.loading).toBe(false);
      expect(state.threads.error).toBeNull();
      expect(state.threads.threads[0]).toHaveProperty('_id');
      expect(state.threads.threads[0]).toHaveProperty('title');
      expect(state.threads.threads[0]).toHaveProperty('content');
    });

    it('should handle fetch threads 401 unauthorized error', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      await store.dispatch(fetchThreads());

      const state = store.getState();
      expect(state.threads.error).toBeTruthy();
      expect(state.threads.threads).toHaveLength(0);
      expect(state.threads.loading).toBe(false);
    });

    it('should handle fetch threads 500 server error', async () => {
      server.use(
        http.get('http://localhost:3000/api/threads', () => {
          return HttpResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
          );
        })
      );

      await store.dispatch(fetchThreads());

      const state = store.getState();
      expect(state.threads.error).toBeTruthy();
      expect(state.threads.threads).toHaveLength(0);
      expect(state.threads.loading).toBe(false);
    });
  });

  describe('Create Thread', () => {
    it('should create a new thread and add it to top of list', async () => {
      await store.dispatch(fetchThreads());
      expect(store.getState().threads.threads).toHaveLength(5);

      const newThreadData = {
        title: 'New Thread',
        content: 'New content',
        subreddit: '507f1f77bcf86cd799439012'
      };

      await store.dispatch(createThreadThunk(newThreadData));

      const state = store.getState();
      expect(state.threads.threads).toHaveLength(6);
      expect(state.threads.threads[0].title).toBe('New Thread');
      expect(state.threads.threads[0].content).toBe('New content');
      expect(state.threads.loading).toBe(false);
      expect(state.threads.error).toBeNull();
    });

    it('should handle thread creation validation error', async () => {
      const initialLength = store.getState().threads.threads.length;

      await store.dispatch(createThreadThunk({ title: '', content: '' }));

      const state = store.getState();
      expect(state.threads.error).toBeTruthy();
      expect(state.threads.threads).toHaveLength(initialLength);
    });
  });

  describe('Fetch Thread By ID', () => {
    it('should fetch single thread by ID', async () => {
      await store.dispatch(fetchThreadById('507f1f77bcf86cd799439011'));

      const state = store.getState();
      expect(state.currentThread.thread).toBeTruthy();
      expect(state.currentThread.thread._id).toBe('507f1f77bcf86cd799439011');
      expect(state.currentThread.loading).toBe(false);
      expect(state.currentThread.error).toBeNull();
      expect(state.currentThread.thread).toHaveProperty('title');
      expect(state.currentThread.thread).toHaveProperty('author');
    });

    it('should handle thread not found error', async () => {
      await store.dispatch(fetchThreadById('invalid-id'));

      const state = store.getState();
      expect(state.currentThread.error).toBeTruthy();
      expect(state.currentThread.thread).toBeNull();
      expect(state.currentThread.loading).toBe(false);
    });

    it('should handle server error when fetching thread', async () => {
      server.use(
        http.get('http://localhost:3000/api/threads/:id', () => {
          return HttpResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
          );
        })
      );

      await store.dispatch(fetchThreadById('507f1f77bcf86cd799439011'));

      const state = store.getState();
      expect(state.currentThread.error).toBeTruthy();
      expect(state.currentThread.thread).toBeNull();
    });
  });

  describe('Upvote Thread', () => {
    it('should upvote thread and update vote count', async () => {
      await store.dispatch(fetchThreads());
      const threadId = store.getState().threads.threads[0]._id;

      await store.dispatch(upvoteThreadThunk(threadId));

      const updatedThread = store.getState().threads.threads[0];
      expect(updatedThread.voteCount).toBe(11);
    });

    it('should increment vote count from upvote', async () => {
      await store.dispatch(fetchThreads());
      const initialVoteCount = store.getState().threads.threads[0].voteCount;

      await store.dispatch(upvoteThreadThunk(store.getState().threads.threads[0]._id));

      expect(store.getState().threads.threads[0].voteCount).toBeGreaterThan(initialVoteCount);
    });
  });

  describe('Downvote Thread', () => {
    it('should downvote thread and update vote count', async () => {
      await store.dispatch(fetchThreads());
      const threadId = store.getState().threads.threads[0]._id;

      await store.dispatch(downvoteThreadThunk(threadId));

      const updatedThread = store.getState().threads.threads[0];
      expect(updatedThread.voteCount).toBe(9);
    });

    it('should decrement vote count from downvote', async () => {
      await store.dispatch(fetchThreads());
      const initialVoteCount = store.getState().threads.threads[0].voteCount;

      await store.dispatch(downvoteThreadThunk(store.getState().threads.threads[0]._id));

      expect(store.getState().threads.threads[0].voteCount).toBeLessThan(initialVoteCount);
    });
  });
});
