import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./halaman/Login";
import Dashboard from "./halaman/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
