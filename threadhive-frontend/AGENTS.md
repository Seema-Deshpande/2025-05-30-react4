# ThreadHive Frontend — Agent Instructions

## Project Overview

ThreadHive is a Reddit-style discussion forum SPA. Users can register/login, browse threads organized by subreddit, vote on threads and comments, create new threads, and post comments. It includes dark mode and responsive design.

**Stack:** React 19, Vite 6, Redux Toolkit 2, React Router DOM v7, Axios 1.x, React-Bootstrap 2 / Bootstrap 5, Bootstrap Icons.

---

## Directory Structure

```
src/
├── api/
│   └── axiosInstance.js       # Axios instance (baseURL: http://localhost:3000/api)
├── config/
│   └── apiConfig.js           # All endpoint constants: AUTH_API, THREAD_API, COMMENT_API, SUBREDDIT_API, USER_API
├── reducers/
│   ├── authSlice.js           # Auth state: token, user, loading, error
│   ├── threadListSlice.js     # Thread list state: threads[], loading, error
│   ├── commentSlice.js        # Comment state: comments[], loading, error  ← INCOMPLETE
│   ├── currentThreadSlice.js  # Single thread state
│   ├── subredditSlice.js      # Subreddit list state
│   └── themeSlice.js          # Dark mode toggle
├── services/
│   ├── authService.js         # login(), register()
│   ├── threadService.js       # fetchRecentThreads(), fetchThreadById(), createThread(), upvoteThread(), downvoteThread()
│   ├── commentService.js      # ← MISSING: fetchComments(), addComment(), upvoteComment(), downvoteComment()
│   └── subredditService.js
├── store/
│   └── store.js               # Redux store (comments reducer not yet wired in)
├── pages/
│   ├── Auth/                  # Login.jsx, Register.jsx
│   └── User/
│       ├── Home.jsx           # Thread list, sorting, pagination, create form
│       ├── ThreadPage.jsx     # Single thread + comments ← comments not wired to Redux
│       └── Profile.jsx
├── components/
│   ├── Comment/               # CommentForm.jsx, CommentList.jsx
│   ├── Shared/
│   │   ├── VoteButtons.jsx    # Reusable upvote/downvote UI
│   │   ├── FilterSortBar.jsx
│   │   └── PaginationComponent.jsx
│   ├── Forms/CreateThreadForm.jsx
│   ├── Header/, Footer/, Sidebar/
│   └── PrivateRoute/PrivateRoute.jsx
└── utils/
    └── handleApiError.js      # Handles 401 (clears token, redirects to /login) + returns error message
```

---

## Coding Conventions

### Redux (always follow these patterns)

- **Always** use `createAsyncThunk` + `builder` pattern in `extraReducers`. Never use `addCase` with `switch`.
- **Always** wrap thunk logic in try/catch and call `thunkAPI.rejectWithValue(handleApiError(err))` in the catch block.
- **Never** access `localStorage` directly inside components — use selectors from slices.
- Selector naming: `selectXxx` (e.g., `selectComments`, `selectCommentsLoading`).
- Initial state shape for async slices: `{ data: [], loading: false, error: null }` — use `data` for threads; use `comments` for comment slice (matches existing pattern).
- Follow `threadListSlice.js` as the reference pattern for all new slices.

### Services

- All services import from `../api/axiosInstance.js` and `../config/apiConfig.js`.
- Services **currently** use a local `getAuthHeaders()` helper that reads `localStorage.getItem('token')`. Mirror this pattern when adding `commentService.js` until the Axios interceptor is added.
- Return `res.data.data` (the API wraps responses in a `data` envelope).
- No business logic in services — just HTTP calls.

### Axios Instance

- Base URL: `http://localhost:3000/api`
- Auth token should eventually be injected via a request interceptor (not yet implemented). When adding the interceptor, read the token from `localStorage.getItem('token')` and set `Authorization: Bearer <token>` on the request config.

### Components

- Use React-Bootstrap components for UI (e.g., `Button`, `Form`, `Spinner`, `Alert`).
- Use Bootstrap Icons via `<i className="bi bi-xxx" />`.
- Dark mode: read `isDarkMode` from `themeSlice` via `useSelector`; apply `data-bs-theme="dark"` or toggle CSS classes — do not manage theme in local component state.
- Private pages must be wrapped with `<PrivateRoute>` in the router.

### Error Handling

- Import `handleApiError` from `../utils/handleApiError.js` in every thunk catch block.
- `handleApiError` automatically handles 401 (clears storage, redirects to `/login`) and returns a string message for other errors.

---

## State Management

ThreadHive uses **Redux Toolkit** exclusively for all shared/global state. No Context API.
1. All global state is managed with Redux Toolkit. The store is configured in `src/store/store.js`
2. Each feature has its own slicew in `src/reducers/` (eg, `authSlice.js`, `threadListSlice.js`)
3. Async operations use `createAsyncThunk`. Track status with `statre.status` (idle| pending|fulfilled|rejected)
4. Handle loading, success, and error states in `extraReducers` using the
builder pattern:
- `.addCase(thunk.pending, ...)` → set loading true, clear error
- `.addCase(thunk.fulfilled, ...)` → update state with payload, set
loading false
- `.addCase(thunk.rejected, ...)` → set loading false, store error from
payload
5. Use `useSelector` to read state and `useDispatch` to dispatch actions,Never import the store directly in components.
6. Never access `localStorage` directly in components — always use Redux
actions (`loginUser`, `logout`, `setUser`).
7. Use `handleApiError` from `src/utils/handleApiError.js` in thunk catch
blocks for consistent error handling
-Always select the most narrow. data neede to minimize re-renders:
```jsx

// BAD - selecting entire user object when only name is needed

const user = userSelector((state)=> state.auth.user)
return <div> {user?.name}</div>


//GOOD - selcdting only the name to minimize re-renders
const user = userSelector((state)=> state.auth.user?.name)
return <div> {user}</div>

### Redux Store Slices

| Slice | Key | State Shape | Purpose |
|---|---|---|---|
| `authSlice` | `auth` | `{ token, user, loading, error }` | JWT token, logged-in user object |
| `threadListSlice` | `threads` | `{ threads[], loading, error }` | Home feed thread list |
| `currentThreadSlice` | `currentThread` | `{ thread, loading, error }` | Single thread detail |
| `commentSlice` | `comments` | `{ comments[], loading, error }` | Comments for the current thread |
| `subredditSlice` | `subreddits` | `{ subreddits[], loading, error }` | Subreddit list for sidebar |
| `themeSlice` | `theme` | `{ isDarkMode }` | Global dark mode toggle |

### Selectors

Each slice exports named selectors. Components must use these — never reach into the store directly.

| Selector | Slice | Returns |
|---|---|---|
| `selectToken` | `authSlice` | JWT string or null |
| `selectUser` | `authSlice` | User object or null |
| `selectAuthLoading` | `authSlice` | boolean |
| `selectAuthError` | `authSlice` | string or null |
| `selectThreads` | `threadListSlice` | Thread array |
| `selectThreadsLoading` | `threadListSlice` | boolean |
| `selectThreadsError` | `threadListSlice` | string or null |
| `selectComments` | `commentSlice` | Comment array |
| `selectCommentsLoading` | `commentSlice` | boolean |
| `selectCommentsError` | `commentSlice` | string or null |
| `selectIsDarkMode` | `themeSlice` | boolean |

### Async Thunk Pattern (required for all slices)

```js
export const myThunk = createAsyncThunk(
  'sliceName/actionName',
  async (arg, thunkAPI) => {
    try {
      return await myServiceCall(arg);
    } catch (err) {
      return thunkAPI.rejectWithValue(handleApiError(err));
    }
  }
);
```

`extraReducers` must handle `pending`, `fulfilled`, and `rejected` for every thunk using the `builder.addCase` pattern.

### Data Flow

```
Component (dispatch) → Thunk → Service → Axios → API
                                                   ↓
Component (useSelector) ← Slice state ← Reducer ←─┘
```

---

## Outstanding Work (Priority Order)

### 1. `commentService.js` — Create this file
Implement four functions using the `COMMENT_API` endpoints from `apiConfig.js`:
- `fetchComments(threadId)` → GET `COMMENT_API.GET_BY_THREAD(threadId)`
- `addComment(data)` → POST `COMMENT_API.CREATE` with body `{ threadId, content }`
- `upvoteComment(commentId)` → POST `COMMENT_API.UPVOTE(commentId)`
- `downvoteComment(commentId)` → POST `COMMENT_API.DOWNVOTE(commentId)`

### 2. `commentSlice.js` — Implement the full slice
Mirror `threadListSlice.js`. Required:
- **Initial state**: `{ comments: [], loading: false, error: null }`
- **Async thunks**: `fetchComments`, `addComment`, `upvoteCommentThunk`, `downvoteCommentThunk`
- **Sync reducer**: `clearComments` — resets to `initialState`
- **`extraReducers`**: pending/fulfilled/rejected for all four thunks
  - `fetchComments.fulfilled` → replace `state.comments`
  - `addComment.fulfilled` → push new comment to `state.comments`
  - `upvoteCommentThunk.fulfilled` / `downvoteCommentThunk.fulfilled` → find comment by `_id` and replace with updated object from API
- **Selectors** (export from the slice file): `selectComments`, `selectCommentsLoading`, `selectCommentsError`

### 3. `store.js` — Wire in comment reducer
Add `comments: commentReducer` to the store's `reducer` map.

### 4. `ThreadPage.jsx` — Wire comments to Redux
- Dispatch `fetchComments(threadId)` in `useEffect` on mount; dispatch `clearComments` on unmount.
- Select `comments`, `loading`, `error` using the selectors from `commentSlice`.
- On comment form submit, dispatch `addComment({ threadId, content })` instead of just clearing text.
- Pass `upvoteCommentThunk` / `downvoteCommentThunk` dispatch calls to vote buttons on comments.

### 5. `axiosInstance.js` — Add auth request interceptor
```js
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```
After adding this, remove the `getAuthHeaders()` helper and manual header injection from all service files.

### 6. Integration Testing (Vitest + MSW)
- Setup: `vitest`, `@testing-library/react`, `@testing-library/user-event`, `msw`
- Add `setupTests.js` with `server.listen/resetHandlers/close`
- Create MSW handlers for all `THREAD_API` and `COMMENT_API` endpoints
- Test suites: thread list render + fetch, create thread flow, comment list render + add comment flow

### 7. Accessibility Audit
Without changing logic or restructuring:
- Add `aria-label` to icon-only buttons (VoteButtons, sidebar toggle)
- Ensure form `<input>`/`<textarea>` elements have associated `<label>` tags
- Use semantic HTML (`<main>`, `<nav>`, `<article>`, `<section>`, `<header>`) in page layouts
- Verify color contrast meets WCAG AA in both light and dark modes
- Ensure all interactive elements are keyboard-reachable (no `tabIndex="-1"` on focusable UI)

---

## API Reference

| Endpoint | Method | Auth Required | Purpose |
|---|---|---|---|
| `/auth/login` | POST | No | Login |
| `/auth/register` | POST | No | Register |
| `/threads` | GET | Yes | All threads |
| `/threads/:id` | GET | Yes | Single thread |
| `/threads` | POST | Yes | Create thread |
| `/threads/:id/upvote` | POST | Yes | Upvote thread |
| `/threads/:id/downvote` | POST | Yes | Downvote thread |
| `/comments/thread/:threadId` | GET | Yes | Comments for thread |
| `/comments` | POST | Yes | Add comment |
| `/comments/:id/upvote` | POST | Yes | Upvote comment |
| `/comments/:id/downvote` | POST | Yes | Downvote comment |
| `/subreddits` | GET | Yes | All subreddits |
| `/subreddits/:id/threads` | GET | Yes | Threads by subreddit |
| `/users/profile` | GET | Yes | Current user profile |

Backend runs at `http://localhost:3000`.

---

## Key Constraints

- Do **not** use Context API — all shared state goes through Redux Toolkit.
- Do **not** use raw `fetch()` — always use `axiosInstance` from `src/api/axiosInstance.js`.
- Do **not** mutate Redux state directly — Immer is built into RTK slices, but use it only through `state.x = ...` assignment, not `.push()` on root state.
- Do **not** add new routing libraries — React Router v7 is the only router.
- Keep API endpoint strings exclusively in `src/config/apiConfig.js`.
