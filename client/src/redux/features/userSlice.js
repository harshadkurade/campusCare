import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null, // This stores the user object
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Replace the entire user object
    },
    updateUserNotifications: (state, action) => {
      if (state.user) {
        // Update notifications and seen notifications
        state.user.notifcation = []; // Clear unread notifications
        state.user.seennotification = action.payload; // Update read notifications
      }
    },
  },
});

export const { setUser, updateUserNotifications } = userSlice.actions;

export default userSlice.reducer;
