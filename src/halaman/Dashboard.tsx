import { useAppSelector } from "../state/hook";
import { getParameterBc } from "../fitur_state/dataParam";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@mantine/core";
// import { getCompKueri, getCompPengguna } from "../fitur_state/pengguna";

const Dashboard = () => {
  const parameterBc = useAppSelector(getParameterBc);
  // const compPengguna = useAppSelector(getCompPengguna);
  // const compKueri = useAppSelector(getCompKueri);
  // console.log(parameterBc);
  // console.log(compPengguna);
  // console.log(compKueri);
  const contohKueri: string = `
    SELECT DISTINCT
      a.${parameterBc.kolom_bc.brand_dim} AS [Brand],
      b.${parameterBc.kolom_bc.name} AS [Label]
    FROM [PRI LIVE${parameterBc.tabel_bc.jurnal_item_437}] AS a
    LEFT JOIN [PRI LIVE${parameterBc.tabel_bc.dim_val_437}] AS b
      ON a.${parameterBc.kolom_bc.brand_dim} = b.${parameterBc.kolom_bc.kode}
    WHERE
      a.${parameterBc.kolom_bc.brand_dim} != '' AND
      a.${parameterBc.kolom_bc.oricode} NOT LIKE '${parameterBc.argumen_bc.item_service_prefix}'
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
