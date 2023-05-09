import { useSelector } from "react-redux";

import { getNamaPengguna } from "../fitur_state/pengguna";

import Layout from "../komponen/Layout";

const Dashboard = () => {
  const namaPengguna = useSelector(getNamaPengguna);
  return (
    <>
      <Layout>Hello {namaPengguna}! Selamat datang di Dashboard!</Layout>
    </>
  );
};

export default Dashboard;
