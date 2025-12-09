import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";
import teacherSlice from "./slices/teacherSlice";
import studentSlice from "./slices/studentSlice";
import chatSlice from "./slices/chatSlice";
import taskSlice from "./slices/taskSlice";
export default configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    teacher: teacherSlice,
    student: studentSlice,
    chat: chatSlice,
    tasks: taskSlice,
  },
});
