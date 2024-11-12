import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Authenticator } from '@aws-amplify/ui-react';
import "./index.css";
import { Amplify } from 'aws-amplify';  // Add this import
import '@aws-amplify/ui-react/styles.css';
import config from "../amplify_outputs.json";

Amplify.configure(config);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator>
      <App  />
    </Authenticator>
  </React.StrictMode>
);