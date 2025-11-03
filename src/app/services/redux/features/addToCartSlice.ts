import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface cartState {
    data: any;
}

const initialState: cartState = {
    data: [],
};

const addToCartSlice = createSlice({
    name: 'addToCartSlice',
    initialState,
    reducers: {
        setAddToCart: (state, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
    },
});

export const { setAddToCart } = addToCartSlice.actions;

export default addToCartSlice.reducer;
