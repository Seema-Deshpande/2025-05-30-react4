import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: () => initialState,
  },
});

export const { clearComments } = commentSlice.actions;

// Selectors
export const selectComments = (state) => state.comments?.comments || [];
export const selectCommentsLoading = (state) => state.comments?.loading || false;
export const selectCommentsError = (state) => state.comments?.error || null;

export default commentSlice.reducer;
