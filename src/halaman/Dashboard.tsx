import { useAppSelector } from "../state/hook";
import { getParameterBC } from "../fitur_state/dataParam";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@mantine/core";

const Dashboard = () => {
  const parameterBC = useAppSelector(getParameterBC);
  const contohKueri: string = `
    SELECT DISTINCT
      ${parameterBC.kolom_bc.brand_dim} AS [Brand]
    FROM [PRI LIVE${parameterBC.tabel_bc.jurnal_item_437}]
    WHERE
      ${parameterBC.kolom_bc.brand_dim} != '' AND
      ${parameterBC.kolom_bc.oricode} NOT LIKE '${parameterBC.argumen_bc.item_service_prefix}'
  `;
  const tarik = async () => {
    try {
      const respon: string = await invoke("brand_ile", {
        kueri: contohKueri,
      });
      const hasil = JSON.parse(respon);
      console.log(hasil);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div>Dashboard</div>
      <Button onClick={() => tarik()}>Tarik</Button>
    </>
  );
};

export default Dashboard;
