# ThreadHive Frontend

A modern, Reddit-style discussion forum single-page application built with React, Vite, and Redux Toolkit.

## 📋 Overview

ThreadHive is a responsive web application that allows users to:
- Register and authenticate securely
- Browse threads organized by subreddit
- Create and manage discussion threads
- Post and reply with comments
- Vote on threads and comments (upvote/downvote)
- Toggle between light and dark modes
- Manage user profiles

The application is built with cutting-edge web technologies and follows modern development best practices including component modularity, state management with Redux Toolkit, and responsive design patterns.

## 🏗️ Architecture

### Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend Framework** | React 19 |
| **Build Tool** | Vite 6 |
| **State Management** | Redux Toolkit 2 |
| **Routing** | React Router DOM v7 |
| **HTTP Client** | Axios 1.x |
| **UI Components** | React-Bootstrap 2 / Bootstrap 5 |
| **Icons** | Bootstrap Icons |

### Backend Integration

- **API Base URL:** `http://localhost:3000/api`
- **Authentication:** JWT Bearer tokens
- **Communication:** RESTful HTTP with JSON

## 📁 Project Structure

```
src/
├── api/                           # API configuration
│   └── axiosInstance.js          # Axios instance with interceptors
├── config/
│   └── apiConfig.js              # API endpoint constants
├── reducers/                      # Redux slices
│   ├── authSlice.js              # Authentication state
│   ├── threadListSlice.js        # Thread list state
│   ├── currentThreadSlice.js     # Single thread detail state
│   ├── commentSlice.js           # Comments state
│   ├── subredditSlice.js         # Subreddit list state
│   └── themeSlice.js             # Dark mode toggle state
├── services/                      # API service functions
│   ├── authService.js            # Auth operations
│   ├── threadService.js          # Thread operations
│   ├── commentService.js         # Comment operations
│   └── subredditService.js       # Subreddit operations
├── store/
│   └── store.js                  # Redux store configuration
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx             # Login page
│   │   └── Register.jsx          # Registration page
│   └── User/
│       ├── Home.jsx              # Thread feed with filtering/sorting
│       ├── ThreadPage.jsx        # Single thread with comments
│       └── Profile.jsx           # User profile page
├── components/
│   ├── Comment/
│   │   ├── CommentForm.jsx       # Add comment form
│   │   └── CommentList.jsx       # Display comments
│   ├── Shared/
│   │   ├── VoteButtons.jsx       # Upvote/downvote UI component
│   │   ├── FilterSortBar.jsx     # Thread filtering and sorting
│   │   └── PaginationComponent.jsx # Pagination controls
│   ├── Forms/CreateThreadForm.jsx # Create thread form
│   ├── Header/Header.jsx          # Navigation header
│   ├── Sidebar/Sidebar.jsx        # Subreddit sidebar
│   ├── Footer/Footer.jsx          # Footer
│   └── PrivateRoute/PrivateRoute.jsx # Protected route wrapper
├── utils/
│   └── handleApiError.js         # Error handling utility
├── App.jsx                       # Root component
├── main.jsx                      # Entry point
└── index.css                     # Global styles
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or higher
- **npm** 9+ or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd threadhive-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Ensure the backend API is running:**
   - The backend should be running on `http://localhost:3000`
   - See backend repository for setup instructions

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Production Build

Build the project for production:

```bash
npm run build
```

The optimized build will be generated in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Check code quality with ESLint:

```bash
npm run lint
```

## 🔐 Authentication

### Login & Registration

- Users can register with email and password
- Login generates a JWT token stored in `localStorage`
- Token is automatically included in all authenticated requests
- 401 Unauthorized responses trigger logout and redirect to login page

### Protected Routes

- All pages under `/user/*` are protected with `PrivateRoute`
- Unauthenticated users are redirected to the login page
- Token is validated on each API request

## 📊 State Management (Redux)

ThreadHive uses Redux Toolkit with async thunks for all global state.

### Redux Slices

| Slice | Purpose | Key Selectors |
|-------|---------|---------------|
| `authSlice` | User authentication & token | `selectToken`, `selectUser`, `selectAuthLoading`, `selectAuthError` |
| `threadListSlice` | Home feed threads | `selectThreads`, `selectThreadsLoading`, `selectThreadsError` |
| `currentThreadSlice` | Single thread detail | `selectCurrentThread`, `selectCurrentThreadLoading` |
| `commentSlice` | Thread comments | `selectComments`, `selectCommentsLoading`, `selectCommentsError` |
| `subredditSlice` | Subreddit list | `selectSubreddits`, `selectSubredditsLoading` |
| `themeSlice` | Dark mode state | `selectIsDarkMode` |

### Async Thunk Pattern

All API operations use Redux async thunks:

```javascript
export const myThunk = createAsyncThunk(
  'sliceName/actionName',
  async (arg, thunkAPI) => {
    try {
      return await myService(arg);
    } catch (err) {
      return thunkAPI.rejectWithValue(handleApiError(err));
    }
  }
);
```

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first design approach
- Responsive grid layout using Bootstrap
- Optimized for desktop, tablet, and mobile devices

### Dark Mode
- Toggle dark mode via theme button in header
- Theme preference is managed globally via Redux
- Consistent styling across all components

### Component Library
- React-Bootstrap for consistent, accessible UI components
- Bootstrap Icons for intuitive visual indicators
- Custom CSS modules for component-specific styling

## 🔗 API Integration

### Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/auth/login` | POST | ❌ | User login |
| `/auth/register` | POST | ❌ | User registration |
| `/threads` | GET | ✅ | Fetch all threads |
| `/threads/:id` | GET | ✅ | Fetch single thread |
| `/threads` | POST | ✅ | Create new thread |
| `/threads/:id/upvote` | POST | ✅ | Upvote thread |
| `/threads/:id/downvote` | POST | ✅ | Downvote thread |
| `/comments/thread/:threadId` | GET | ✅ | Fetch comments for thread |
| `/comments` | POST | ✅ | Create comment |
| `/comments/:id/upvote` | POST | ✅ | Upvote comment |
| `/comments/:id/downvote` | POST | ✅ | Downvote comment |
| `/subreddits` | GET | ✅ | Fetch all subreddits |
| `/subreddits/:id/threads` | GET | ✅ | Fetch threads by subreddit |
| `/users/profile` | GET | ✅ | Fetch user profile |

### Error Handling

- API errors are caught in async thunks using `handleApiError()`
- 401 Unauthorized responses trigger automatic logout and redirect
- Error messages are stored in Redux state and displayed to users
- User-friendly error notifications in the UI

## 💡 Key Conventions

### Redux Best Practices
- ✅ Use `createAsyncThunk` with builder pattern for all async operations
- ✅ Always wrap thunk logic in try/catch with `handleApiError()`
- ✅ Select specific data needed to minimize re-renders
- ✅ Never access `localStorage` directly in components

### Service Layer
- ✅ All HTTP calls use `axiosInstance` from `src/api/`
- ✅ Services only handle HTTP communication
- ✅ Return `res.data.data` (API response wrapper)
- ✅ No business logic in service functions

### Component Development
- ✅ Use React-Bootstrap components for UI consistency
- ✅ Read theme state from Redux, not component state
- ✅ Wrap protected pages with `PrivateRoute`
- ✅ Dispatch Redux actions for state updates

## 🧪 Testing

The project includes support for:
- **Vitest:** Unit and integration testing
- **React Testing Library:** Component testing
- **MSW (Mock Service Worker):** API mocking

### Running Tests
*(To be configured during development)*

```bash
npm run test
npm run test:ui
npm run test:coverage
```

## ♿ Accessibility

ThreadHive aims to meet WCAG 2.1 Level AA standards:
- Semantic HTML structure (`<main>`, `<nav>`, `<article>`, etc.)
- ARIA labels on icon-only buttons
- Associated labels for form inputs
- Color contrast compliance in light and dark modes
- Full keyboard navigation support

## 📦 Dependencies Overview

### Production
- **react/react-dom:** UI framework
- **@reduxjs/toolkit:** State management
- **react-redux:** Redux React integration
- **react-router-dom:** Routing
- **axios:** HTTP client
- **bootstrap/react-bootstrap:** UI components
- **bootstrap-icons:** Icon library

### Development
- **vite:** Fast build tool
- **eslint:** Code linting
- **@vitejs/plugin-react:** React support in Vite

## 🔄 Development Workflow

1. **Create a branch** for your feature/bugfix
2. **Install dependencies** if needed: `npm install`
3. **Start dev server:** `npm run dev`
4. **Make changes** following project conventions
5. **Lint code:** `npm run lint`
6. **Test changes** in the browser
7. **Build for production:** `npm run build`
8. **Preview build:** `npm run preview`
9. **Submit pull request** with clear description

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
npm run dev -- --port 3001
```

### Backend Connection Issues
- Ensure backend is running on `http://localhost:3000`
- Check network tab in DevTools for API calls
- Verify CORS configuration on backend

### Redux DevTools
The Redux store is compatible with Redux DevTools browser extension for debugging state changes.

## 📝 License

This project is part of the Great Learning curriculum.

## 👥 Support

For issues or questions, refer to the project documentation or contact the development team.

---

**Version:** 0.0.0  
**Last Updated:** May 2026
