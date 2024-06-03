import { configureStore } from "@reduxjs/toolkit";
import userSlices from "../slices/userSlices";

export const store=configureStore({
    reducer:{
        userData:userSlices
    }
})