import "./style/normal.css";
import "./style/App.css";
import Login from "./pages/Login";
import React from 'react'
import {Route, Routes } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak"

import PrivateRoute from './helpers/PrivateRoute';
import DataUploading from "./pages/DataUploading.jsx/DataUploading";
import Prompting from "./pages/Prompting/Prompting";
import Introduction from "./pages/Introduction/Introduction";
import Header from "./pages/Header";
import PrivacyPolicy from "./misc/PrivacyPolicy";
import Imprint from "./misc/Imprint";
import TermOfUse from "./misc/TermOfUse";
function App() {
  return (
    <div className="App">
      <ReactKeycloakProvider authClient={keycloak} LoadingComponent={(<p>Loading...</p>)} initOptions={{ checkLoginIframe: false, responseMode: 'query' }}>
        <Header />
        <Routes>
          <Route path="/introduction" element={<PrivateRoute><Introduction /></PrivateRoute>} />
          <Route path="/data-uploading" element={<PrivateRoute><DataUploading /></PrivateRoute>} />
          <Route path="/prompting" element={<PrivateRoute><Prompting /></PrivateRoute>} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/imprint" element={<Imprint />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/term-of-use" element={<TermOfUse />} />
        </Routes>
      </ReactKeycloakProvider>
    </div>
  );
}

export default App;