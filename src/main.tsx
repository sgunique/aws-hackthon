import React from "react";
import ReactDOM from "react-dom/client";
import App from "./index.tsx";
import "./index.css";
import { Amplify } from 'aws-amplify';  // Add this import
import config from '@root/amplify_outputs.json';  // Add this import

Amplify.configure(config);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);