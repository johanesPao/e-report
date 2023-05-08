import { useSelector, useDispatch } from "react-redux";

import { getNamaPengguna } from "../fitur_state/pengguna";

import Layout from "../komponen/Layout";

const Dashboard = () => {
  const namaPengguna = useSelector(getNamaPengguna);
  return (
    <div>
      <Layout>
        <p>Hello {namaPengguna}!</p>
      </Layout>
    </div>
  );
};

export default Dashboard;
