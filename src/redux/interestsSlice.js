import { createSlice } from "@reduxjs/toolkit";

const interestsSlice = createSlice({
    name: "requestSent",
    initialState: [],
    reducers: {
        addInterests: (state, action) => {
            return action.payload;
        },
        pushInterest: (state, action) => {
            state.push(action.payload);
        },
        removeInterest: (state, action) =>{
            return state.filter((element)=> element._id !== action.payload._id);
        },
        clearInterests: () => {
            return [];
        }
    }
});

export const {addInterests, pushInterest, removeInterest, clearInterests} = interestsSlice.actions;

export default interestsSlice.reducer