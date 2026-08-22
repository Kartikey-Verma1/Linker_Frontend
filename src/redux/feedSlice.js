import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: [],
    reducers: {
        addFeed: (state, action)=>{
            const existingIds = new Set(state.map(item => item._id));
            const newItems = action.payload.filter(item => !existingIds.has(item._id));
            state.push(...newItems)
        },
        removeFrontFeed: (state)=>{
            state.splice(0, 1);
        },
        removeFeedUser: (state, action)=>{
            return state.filter((e) => e._id != action.payload._id);
        },
        clearFeed: ()=>{
            return [];
        }
    }
});

export const {addFeed, removeFrontFeed, removeFeedUser, clearFeed} = feedSlice.actions;

export default feedSlice.reducer;