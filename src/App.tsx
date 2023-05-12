import { Routes, Route } from "react-router-dom";

import Login from "./halaman/Login";
import Konten from "./komponen/Konten";

function App() {
  return (
    <>
      <Routes>
        <Route index path="/" element={<Login />} />
        <Route path="/konten" element={<Konten />} />
      </Routes>
    </>
  );
}

export default App;
