import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    userData: any;
}

const initialState: UserState = {
    userData: {},
};

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            state.userData = action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
