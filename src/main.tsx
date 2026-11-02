import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/familjen-grotesk"; // served with the app, so visitors' IPs don't go to Google
import "./styles/global.css";
import "./i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";
import AuthGuard from "./components/AuthGuard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Week from "./pages/Week";
import History from "./pages/History";
import Household from "./pages/Household";
import Account from "./pages/Account";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

const router = createBrowserRouter([
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <AuthGuard><Layout /></AuthGuard>,
    children: [
      { index: true, element: <Week /> },
      { path: "history", element: <History /> },
      { path: "household", element: <Household /> },
      { path: "account", element: <Account /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
