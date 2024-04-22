import "./normal.css";
import "./App.css";
import Login from "./pages/Login";
import React, {Suspense, lazy} from 'react'
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak"

import PrivateRoute from './helpers/PrivateRoute';
import DataUploading from "./pages/DataUploading.jsx/DataUploading";
import Prompting from "./pages/Prompting/Prompting";
import Introduction from "./pages/Introduction/Introduction";

function App() {
  return (
    <div className="App">
      <ReactKeycloakProvider authClient={keycloak} LoadingComponent={(<p>Loading...</p>)} initOptions={{ checkLoginIframe: true, responseMode: 'query' }}>
          <Routes>
            <Route path="/introduction" element={<PrivateRoute><Introduction /></PrivateRoute>} />
            <Route path="/data-uploading" element={<PrivateRoute><DataUploading /></PrivateRoute>} />
            <Route path="/prompting" element={<PrivateRoute><Prompting /></PrivateRoute>} />
            <Route path="/" element={<Login />} />
          </Routes>
      </ReactKeycloakProvider>
    </div>
  );
}

export default App;