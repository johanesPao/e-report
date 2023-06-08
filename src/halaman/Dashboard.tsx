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
import { getIndeksData } from "../fitur_state/event";

const Dashboard = () => {
  const parameterBc = useAppSelector(getParameterBc);
  const compPengguna = useAppSelector(getCompPengguna);
  let compKueri = useAppSelector(getCompKueri);
  const indeksData = useAppSelector(getIndeksData);
  const tglAwal: string = "2023-04-01";
  const tglAkhir: string = "2023-04-30";

  const tarik = async () => {
    try {
      console.log(compKueri);
      const singleMode: boolean = compPengguna.length === 1;
      if (!singleMode) {
        compKueri = parameterBc.tabel_bc[`${
          indeksData ? 
          parameterBc.comp.pnt.toLowerCase() : 
          parameterBc.comp.pri.toLowerCase()
        }`]
      }
      const arrKueri: setKueri[] = [
        ILEByPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
        salespersonAndRegionByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
        tokoByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
        produkByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
        vatByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
        promoByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
        diskonByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
        dokumenLainnyaByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
        quantityByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
        cppuByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
        rppuByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
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
