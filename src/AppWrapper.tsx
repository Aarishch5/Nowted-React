import { useContext } from "react";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./context/UserContext.ts";

const AppWrapper = () => {
  const { mode } = useContext(UserContext);

  return (
    <>
      <App />
      <ToastContainer
        position="top-center"
        autoClose={2001}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={mode ? "dark" : "light"}
      />
    </>
  );
};

export default AppWrapper;