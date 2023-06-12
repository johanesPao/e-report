import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

import { useAppDispatch, useAppSelector } from "../state/hook";
import { getIndeksData, getKonekKeBC } from "../fitur_state/event";
import { TombolDrawer } from "../komponen/TombolDrawer";
import { PropsPenjualan } from "../komponen/Konten";
import {
  ILEByPostDate,
  cppuByILEPostDate,
  diskonByILEPostDate,
  dokumenLainnyaByILEPostDate,
  klasifikasiByILEPostDate,
  produkByILEPostDate,
  promoByILEPostDate,
  quantityByILEPostDate,
  rppuByILEPostDate,
  salespersonAndRegionByILEPostDate,
  Kueri,
  tokoByILEPostDate,
  vatByILEPostDate,
} from "../fungsi/kueri";
import { getParameterBc } from "../fitur_state/dataParam";
import { getCompKueri, getCompPengguna } from "../fitur_state/pengguna";
import {
  Dimensi,
  Filter,
  dimensiBazaarOthers,
  dimensiECommerce,
  dimensiFisikFootball,
  dimensiFisikSport,
  dimensiOurDailyDose,
  dimensiWholesale,
} from "../fungsi/basic";

const Penjualan = ({
  propsPenjualan,
  propsMuatDataPenjualan,
}: {
  propsPenjualan: PropsPenjualan;
  propsMuatDataPenjualan: boolean;
}) => {
  const dispatch = useAppDispatch();
  const konekKeBc = useAppSelector(getKonekKeBC);
  const parameterBc = useAppSelector(getParameterBc);
  const compPengguna = useAppSelector(getCompPengguna);
  let compKueri = useAppSelector(getCompKueri);
  const indeksData = useAppSelector(getIndeksData);

  useEffect(() => {
    async function tarik_data_penjualan() {
      const singleMode: boolean = compPengguna.length === 1;
      let compPRI: boolean;
      let tglAwal: string;
      let tglAkhir: string;
      let arrFilter: Filter;
      let arrKueri: Kueri[];
      let arrDimensi: Dimensi[];

      if (!singleMode) {
        compKueri =
          parameterBc.tabel_bc[
            `${
              indeksData
                ? parameterBc.comp.pnt.toLowerCase()
                : parameterBc.comp.pri.toLowerCase()
            }`
          ];
        compPRI = indeksData == 0;
      } else {
        compPRI = compPengguna[0] === parameterBc.comp.pri;
      }

      if (propsPenjualan.tglAwal !== null && propsPenjualan.tglAkhir !== null) {
        tglAwal = propsPenjualan.tglAwal.toISOString().split("T")[0];
        tglAkhir = propsPenjualan.tglAkhir.toISOString().split("T")[0];
        arrFilter = {
          brand: propsPenjualan.brand,
          prod_div: propsPenjualan.prodDiv,
          prod_grp: propsPenjualan.prodGrp,
          prod_cat: propsPenjualan.prodCat,
          sbu: compPRI ? propsPenjualan.SBU : [],
          lokasi: compPRI ? propsPenjualan.lokasi : [],
          klasifikasi: compPRI ? [] : propsPenjualan.klasifikasi,
          region: compPRI ? [] : propsPenjualan.region,
        };
        arrKueri = [
          ILEByPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          salespersonAndRegionByILEPostDate(
            parameterBc,
            tglAwal,
            tglAkhir,
            compKueri
          ),
          tokoByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          produkByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          vatByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          promoByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          diskonByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          dokumenLainnyaByILEPostDate(
            parameterBc,
            tglAwal,
            tglAkhir,
            compKueri
          ),
          quantityByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          cppuByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          rppuByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          klasifikasiByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
        ];

        arrDimensi = [
          dimensiECommerce(parameterBc),
          dimensiFisikSport(parameterBc),
          dimensiFisikFootball(parameterBc),
          dimensiOurDailyDose(parameterBc),
          dimensiWholesale(parameterBc),
          dimensiBazaarOthers(parameterBc),
        ];

        try {
          const respon: string = await invoke("handle_data_penjualan", {
            setKueri: arrKueri,
            rppu: compPRI,
            setDimensi: arrDimensi,
            filterData: arrFilter,
          });
          const hasil = JSON.parse(respon);
          console.log(hasil);
        } catch (e) {
          console.log(e);
        }
      }
    }

    if (propsMuatDataPenjualan) {
      tarik_data_penjualan();
    }
  }, [propsPenjualan]);

  return (
    <>
      <TombolDrawer
        label="Input Parameter Penjualan"
        nonAktif={konekKeBc}
        aksiRedux={dispatch}
        warna="teal"
      />
      <div>Nilai Tgl Awal: {`${propsPenjualan.tglAwal}`}</div>
      <div>Nilai Tgl Akhir: {`${propsPenjualan.tglAkhir}`}</div>
      <div>Nilai Brand: {`${propsPenjualan.brand}`}</div>
      <div>Nilai Produk Divisi: {`${propsPenjualan.prodDiv}`}</div>
      <div>Nilai Produk Group: {`${propsPenjualan.prodGrp}`}</div>
      <div>Nilai Produk Category: {`${propsPenjualan.prodCat}`}</div>
      <div>Nilai SBU: {`${propsPenjualan.SBU}`}</div>
      <div>Nilai Lokasi: {`${propsPenjualan.lokasi}`}</div>
      <div>Nilai Klasifikasi: {`${propsPenjualan.klasifikasi}`}</div>
      <div>Nilai Region: {`${propsPenjualan.region}`}</div>
      {propsMuatDataPenjualan ? (
        <div>Memuat data penjualan</div>
      ) : (
        <div>Menunggu instruksi</div>
      )}
    </>
  );
};

export default Penjualan;
