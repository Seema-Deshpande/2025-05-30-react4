export const waitForLoadingToFinish = (store) => {
  return new Promise(resolve => {
    const checkLoading = () => {
      const state = store.getState();
      if (
        !state.threads.loading &&
        !state.currentThread.loading &&
        !state.comments.loading
      ) {
        resolve();
      } else {
        setTimeout(checkLoading, 10);
      }
    };
    checkLoading();
  });
};

export const getThreadsFromState = (store) => {
  return store.getState().threads.threads;
};

export const getCommentsFromState = (store) => {
  return store.getState().comments.comments;
};

export const getCurrentThreadFromState = (store) => {
  return store.getState().currentThread.thread;
};

export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
};

export const resetLocalStorage = () => {
  localStorage.clear();
};
