import { Routes, Route } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import Login from "./halaman/Login";
import Konten from "./komponen/Konten";

function App() {
  return (
    <>
      <SimpleBar style={{ maxHeight: "100vh" }}>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/konten" element={<Konten />} />
        </Routes>
      </SimpleBar>
    </>
  );
}

export default App;
