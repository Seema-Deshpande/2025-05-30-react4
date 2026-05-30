import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, register} from '../services/authService'
const token  = localStorage.getItem("token");
const localUser = localStorage.getItem("user");
const user = localUser ? JSON.parse(localUser) : null;

const initialState = {
    token,
    user,
    login:{
        status: 'idle',
        error: null
    },
    register:{
        status: 'idle',
        error: null
    }    
}

export const loginUser = createAsyncThunk (
    'auth/loginUser',
    async (input, thunkAPI) => {
        try {
            const data = await login(input)
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        }catch (error){
            const message = error.response?.data?.message || error.message || "Login failed";
            return thunkAPI.rejectWithValue(message);
        }
    
    }
)

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async(input, thunkAPI) => {
        try {
            const data = await register(input)
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        }catch (error){
            const message = error.response?.data?.message || error.message || "Registration failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const saveUser = (user) =>{
    localStorage.setItem('user', JSON.stringify(user));
    return function(dispatch) {
        dispatch(authSlice.actions.setuser(user));
    }
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuthState: (state) => {
            state.login.status = 'idle';
            state.login.error = null;
            state.register.status = 'idle';
            state.register.error = null;
        },
        setuser: (state, action) => {
            state.user = action.payload;
            
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.login.status = 'pending';
                state.login.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.login.status = 'fulfilled';
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.login.status = 'rejected';
                state.login.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.register.status = 'pending';
                state.register.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.register.status = 'fulfilled';
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.register.status = 'rejected';
                state.register.error = action.payload;
            });
    }
});



export default authSlice.reducer;
export const clearAuthState = authSlice.actions.clearAuthState