import { createRoot } from "react-dom/client";
import "./index.css";

import UserProvider from "./context/UserProvider.tsx";
import { BrowserRouter } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

import AppWrapper from "./AppWrapper.tsx";


createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <UserProvider>
        <AppWrapper />
    </UserProvider>
  </BrowserRouter>,
);
