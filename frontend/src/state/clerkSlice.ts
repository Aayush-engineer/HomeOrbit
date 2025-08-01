import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
}

interface ClerkState {
  user: AppUser | null;
  token: string | null;
  role: string | null;
}

const initialState: ClerkState = {
  user: null,
  token: null,
  role: null,
};

const clerkSlice = createSlice({
  name: "clerk",
  initialState,
  reducers: {
    setClerkAuth: (
      state,
      action: PayloadAction<{ user: AppUser; token: string; role: string }>
    ) => {
      console.log("Dispatched Clerk User", action.payload.user);
      console.log("dispatch clerk role",action.payload.role);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    clearClerkAuth: () => initialState,
  },
});

export const { setClerkAuth, clearClerkAuth } = clerkSlice.actions;
export default clerkSlice.reducer;
