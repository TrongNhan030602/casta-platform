import React, { useEffect } from "react";
import AppRoutes from "@/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { restoreSession } from "@/redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  const sessionChecked = useSelector((state) => state.auth.sessionChecked);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (!sessionChecked) {
    return null; // hoặc <LoadingScreen />
  }

  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  );
}

export default App;
