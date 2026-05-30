import { setupServer } from 'msw/node';
import { threadHandlers } from './handlers/thread.handlers.js';
import { commentHandlers } from './handlers/comment.handlers.js';

export const server = setupServer(...threadHandlers, ...commentHandlers);
