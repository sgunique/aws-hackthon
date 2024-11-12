import React from "react";
import ReactDOM from "react-dom/client";
import AuthenticatedApp from "./Authencation";
import "./index.css";
import { Amplify } from 'aws-amplify';  // Add this import
import config from "../amplify_outputs.json";

Amplify.configure(config);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthenticatedApp />
  </React.StrictMode>
);