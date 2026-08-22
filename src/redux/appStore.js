import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import requestReducer from "./requestsSlice.js";
import connectionReducer from "./connectionsSlice.js";
import feedReducer from "./feedSlice.js";
import interestsReducer from "./interestsSlice.js"

const appStore = configureStore({
    reducer: {
        user: userReducer,
        requests: requestReducer,
        connections: connectionReducer,
        feed: feedReducer,
        interests: interestsReducer
    }
});

export default appStore;