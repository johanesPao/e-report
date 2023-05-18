import { useAppSelector } from "../state/hook";
import { getParameterBc } from "../fitur_state/dataParam";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@mantine/core";

const Dashboard = () => {
  const parameterBc = useAppSelector(getParameterBc);
  const contohKueri: string = `
    SELECT DISTINCT
      ${parameterBc.kolom_bc.brand_dim} AS [Brand]
    FROM [PRI LIVE${parameterBc.tabel_bc.jurnal_item_437}]
    WHERE
      ${parameterBc.kolom_bc.brand_dim} != '' AND
      ${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
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
