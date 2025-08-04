import ReactDOM from "react-dom/client";
import App from "./App";
import AppProvider from "@/providers/AppProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProvider>
    <App />
  </AppProvider>
);
