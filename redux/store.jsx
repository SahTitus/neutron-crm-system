import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authSlice from "./features/authSlice";
import leadSlice from "./features/leadSlice";
import customerSlice from "./features/customerSlice";
import taskSlice from "./features/taskSlice";
import opportunitySlice from "./features/opportunitySlice";
import campaignSlice from "./features/campaignSlice";
import employeeSlice from "./features/employeeSlice";
import recentActivitySlice from "./features/recentActivitySlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    lead: leadSlice,
    task: taskSlice,
    campaign: campaignSlice,
    employee: employeeSlice,
    customer: customerSlice,
    opportunity: opportunitySlice,
    activity: recentActivitySlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;