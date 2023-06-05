import { useAppSelector } from "../state/hook";
import { getParameterBc } from "../fitur_state/dataParam";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@mantine/core";
import { getCompKueri, getCompPengguna } from "../fitur_state/pengguna";
import {
  ILEByPostDate,
  cppuByILEPostDate,
  diskonByILEPostDate,
  dokumenLainnyaByILEPostDate,
  produkByILEPostDate,
  promoByILEPostDate,
  quantityByILEPostDate,
  rppuByILEPostDate,
  salespersonAndRegionByILEPostDate,
  setKueri,
  tokoByILEPostDate,
  vatByILEPostDate,
} from "../fungsi/kueri";

const Dashboard = () => {
  const parameterBc = useAppSelector(getParameterBc);
  const compPengguna = useAppSelector(getCompPengguna);
  const compKueri = useAppSelector(getCompKueri);
  const tglAwal: string = "2023-04-01";
  const tglAkhir: string = "2023-04-30";

  const tarik = async () => {
    try {
      const arrKueri: setKueri[] = [
        ILEByPostDate(parameterBc, tglAwal, tglAkhir),
        salespersonAndRegionByILEPostDate(parameterBc, tglAwal, tglAkhir),
        tokoByILEPostDate(parameterBc, tglAwal, tglAkhir),
        produkByILEPostDate(parameterBc, tglAwal, tglAkhir),
        vatByILEPostDate(parameterBc, tglAwal, tglAkhir),
        promoByILEPostDate(parameterBc, tglAwal, tglAkhir),
        diskonByILEPostDate(parameterBc, tglAwal, tglAkhir),
        dokumenLainnyaByILEPostDate(parameterBc, tglAwal, tglAkhir),
        quantityByILEPostDate(parameterBc, tglAwal, tglAkhir),
        cppuByILEPostDate(parameterBc, tglAwal, tglAkhir),
        rppuByILEPostDate(parameterBc, tglAwal, tglAkhir),
      ];

      const respon: string = await invoke("handle_data_penjualan", {
        setKueri: arrKueri,
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
