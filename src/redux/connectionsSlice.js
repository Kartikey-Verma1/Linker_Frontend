import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
    name: "connections",
    initialState: null,
    reducers: {
        addConnections: (state, action)=>{
            return action.payload;
        },
        pushConnection: (state, action)=>{
            state.push(action.payload);
        },
        removeConnection: (state, action)=>{
            return state.filter((element)=>element._id != action.payload._id);
        },
        clearConnection: ()=>{
            return null;
        }
    }
});

export const {addConnections, pushConnection, removeConnection, clearConnection} = connectionsSlice.actions;

export default connectionsSlice.reducer;