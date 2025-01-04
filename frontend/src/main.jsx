import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AddNewPizza from "./components/AddNewPizza.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserPizzas from "./components/UserPizzas.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
  },
  {
    path: "/addNewPizza",
    element: <AddNewPizza></AddNewPizza>,
  },
  {
    path: "/userPizza",
    element: <UserPizzas></UserPizzas>,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
    <StrictMode>
      <App />
    </StrictMode>
  </RouterProvider>
);
