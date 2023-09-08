import { invoke } from "@tauri-apps/api/tauri";
import { IconCheck, IconX } from "@tabler/icons-react";

import {
  DataMultiSelect,
  setParameterBrand,
  setParameterDiv,
  setParameterGroup,
  setParameterCat,
  setParameterLokasi,
  setParameterKlasifikasi,
  setParameterRegion,
  setParameterBc,
  setParameterSBU,
  setBrandInput,
  setDivInput,
  setGrpInput,
  setCatInput,
  setLokasiInput,
  setKlasifikasiInput,
  setRegionInput,
  setSBUInput,
} from "../../fitur_state/dataParam";
import { resetAplikasi, toTitle } from "../basic";
import {
  kueriBrandLabel,
  kueriKlasifikasiLabel,
  kueriLokasiLabel,
  kueriMCLabel,
  kueriRegionLabel,
} from "../kueri";
import {
  setAuthGagal,
  setIndeksData,
  setKonekKeBC,
  setProsesAuth,
  setSesiAktif,
} from "../../fitur_state/event";
import { appWindow } from "@tauri-apps/api/window";
import {
  PenggunaState,
  setCompKueri,
  setCompPengguna,
  setDepartemenPengguna,
  setEmailPengguna,
  setIdPengguna,
  setNamaPengguna,
  setPeranPengguna,
} from "../../fitur_state/pengguna";
import { notifications } from "@mantine/notifications";
import React from "react";
import LogRocket from "logrocket";
import { NavigateFunction } from "react-router-dom";

export const bcDalamJangkauan = async (
  toggleKoneksiBC: React.Dispatch<React.SetStateAction<boolean>>,
  setBCTersedia: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const respon: string = await invoke("cek_koneksi_bc");
    const hasil = JSON.parse(respon);
    if (!hasil["status"]) {
      toggleKoneksiBC(false);
      setBCTersedia(false);
    } else {
      toggleKoneksiBC(true);
      setBCTersedia(true);
    }
  } catch (e) {
    toggleKoneksiBC(false);
    setBCTersedia(false);
  }
};

const brandLabel = async (parameterBc: any, comp: string) => {
  // tarik data brand
  try {
    const respon: string = await invoke("kueri_sederhana", {
      kueri: kueriBrandLabel(parameterBc, comp),
    });
    const hasil = JSON.parse(respon);
    if (hasil["status"]) {
      let arrBrandLabel: DataMultiSelect[] = [];
      hasil["konten"].map((data: string) =>
        arrBrandLabel.push({ label: toTitle(data[1]), value: data[0] })
      );
      return arrBrandLabel;
    }
  } catch (e) {
    console.log(e);
  }
};

const mcLabel = async (parameterBc: any, comp: string) => {
  const kueri: string[] = kueriMCLabel(parameterBc, comp);

  // tarik data MC
  try {
    let arrMcLabel: DataMultiSelect[][][] = [];
    const mcLabelPromises = kueri.map(async (kueriItem) => {
      const respon: string = await invoke("kueri_sederhana", {
        kueri: kueriItem,
      });
      const hasil = JSON.parse(respon);
      if (hasil !== undefined && hasil.length !== 0) {
        // destrukturisasi dan labeling
        let arrMc: DataMultiSelect[] = [];
        hasil["konten"].map((mcItem: string) => {
          arrMc.push({ label: toTitle(mcItem[1]), value: mcItem[0] });
        });
        return arrMc;
      }
    });

    const mcLabelJamak = await Promise.all(mcLabelPromises);
    const mcLabelValid = mcLabelJamak.filter(
      (hasil): hasil is DataMultiSelect[] => hasil !== undefined
    );
    arrMcLabel.push(mcLabelValid);
    return arrMcLabel;
  } catch (e) {
    console.log(e);
  }
};

const lokasiLabel = async (parameterBc: any, comp: string) => {
  // tarik data lokasi
  try {
    const respon: string = await invoke("kueri_sederhana", {
      kueri: kueriLokasiLabel(parameterBc, comp),
    });
    const hasil = JSON.parse(respon);
    if (hasil["status"]) {
      let arrLokasiLabel: DataMultiSelect[] = [];
      hasil["konten"].map((data: string) =>
        arrLokasiLabel.push({ label: data[0], value: data[0] })
      );
      return arrLokasiLabel;
    }
  } catch (e) {
    console.log(e);
  }
};

const klasifikasiLabel = async (parameterBc: any, comp: string) => {
  // tarik data klasifikasi
  try {
    const respon: string = await invoke("kueri_sederhana", {
      kueri: kueriKlasifikasiLabel(parameterBc, comp),
    });
    const hasil = JSON.parse(respon);
    if (hasil["status"]) {
      let arrKlasifikasiLabel: DataMultiSelect[] = [];
      hasil["konten"].map((data: string) =>
        arrKlasifikasiLabel.push({ label: toTitle(data[1]), value: data[0] })
      );
      return arrKlasifikasiLabel;
    }
  } catch (e) {
    console.log(e);
  }
};

const regionLabel = async (parameterBc: any, comp: string) => {
  // tarik data region
  try {
    const respon: string = await invoke("kueri_sederhana", {
      kueri: kueriRegionLabel(parameterBc, comp),
    });
    const hasil = JSON.parse(respon);
    if (hasil["status"]) {
      let arrRegionLabel: DataMultiSelect[] = [];
      hasil["konten"].map((data: string) =>
        arrRegionLabel.push({ label: toTitle(data[1]), value: data[0] })
      );
      return arrRegionLabel;
    }
  } catch (e) {
    console.log(e);
  }
};

const muatBrand = async (
  compPengguna: string[],
  parameterBc: { [key: string]: { [key: string]: string } },
  dispatch: any
) => {
  const arrayBrandLabel: DataMultiSelect[][] = [];
  if (compPengguna.length === 1) {
    const respon = await brandLabel(
      parameterBc,
      parameterBc.tabel_bc[`${compPengguna[0].toLowerCase()}`]
    );
    if (respon !== undefined && respon.length !== 0) {
      arrayBrandLabel.push(respon);
      dispatch(setParameterBrand(arrayBrandLabel));
      dispatch(setBrandInput([respon.map((item) => item.value)]));
    }
  } else {
    const brandLabelPromises = compPengguna.map(async (comp) => {
      const respon = await brandLabel(
        parameterBc,
        parameterBc.tabel_bc[`${comp.toLowerCase()}`]
      );
      if (respon !== undefined && respon.length !== 0) {
        return respon;
      }
    });

    const brandLabelJamak = await Promise.all(brandLabelPromises);
    const brandLabelValid = brandLabelJamak.filter(
      (hasil): hasil is DataMultiSelect[] => hasil !== undefined
    );
    arrayBrandLabel.push(...brandLabelValid);
    dispatch(setParameterBrand(arrayBrandLabel));
    let arrBrandComp: string[][] = [];
    for (var indeks in arrayBrandLabel) {
      const arrBrand: string[] = arrayBrandLabel[indeks].map(
        (brand: DataMultiSelect) => brand.value
      );
      arrBrandComp.push(arrBrand);
    }
    dispatch(setBrandInput(arrBrandComp));
  }
};

const muatMC = async (
  compPengguna: string[],
  parameterBc: { [key: string]: { [key: string]: string } },
  dispatch: any
) => {
  if (compPengguna.length === 1) {
    const respon = await mcLabel(
      parameterBc,
      parameterBc.tabel_bc[`${compPengguna[0].toLowerCase()}`]
    );
    if (respon !== undefined && respon.length !== 0) {
      dispatch(setParameterDiv([respon[0][0]]));
      dispatch(setParameterGroup([respon[0][1]]));
      dispatch(setParameterCat([respon[0][2]]));
      dispatch(
        setDivInput([respon[0][0].map((item: DataMultiSelect) => item.value)])
      );
      dispatch(
        setGrpInput([respon[0][1].map((item: DataMultiSelect) => item.value)])
      );
      dispatch(
        setCatInput([respon[0][2].map((item: DataMultiSelect) => item.value)])
      );
    }
  } else {
    const mcLabelPromises = compPengguna.map(async (comp) => {
      const respon = await mcLabel(
        parameterBc,
        parameterBc.tabel_bc[`${comp.toLocaleLowerCase()}`]
      );
      if (respon !== undefined && respon.length !== 0) {
        return respon;
      }
    });

    const mcLabelJamak = await Promise.all(mcLabelPromises);
    const mcLabelValid = mcLabelJamak.filter(
      (hasil): hasil is DataMultiSelect[][][] => hasil !== undefined
    );
    dispatch(setParameterDiv([mcLabelValid[0][0][0], mcLabelValid[1][0][0]]));
    dispatch(setParameterGroup([mcLabelValid[0][0][1], mcLabelValid[1][0][1]]));
    dispatch(setParameterCat([mcLabelValid[0][0][2], mcLabelValid[1][0][2]]));
    let arrDivComp: string[][] = [];
    let arrGrpComp: string[][] = [];
    let arrCatComp: string[][] = [];
    for (var indeks in mcLabelValid) {
      arrDivComp.push(
        mcLabelValid[indeks][0][0].map((item: DataMultiSelect) => item.value)
      );
      arrGrpComp.push(
        mcLabelValid[indeks][0][1].map((item: DataMultiSelect) => item.value)
      );
      arrCatComp.push(
        mcLabelValid[indeks][0][2].map((item: DataMultiSelect) => item.value)
      );
    }
    dispatch(setDivInput(arrDivComp));
    dispatch(setGrpInput(arrGrpComp));
    dispatch(setCatInput(arrCatComp));
  }
};

const muatLokasi = async (
  compPengguna: string[],
  parameterBc: { [key: string]: { [key: string]: string } },
  dispatch: any
) => {
  const arrayLokasiLabel: DataMultiSelect[][] = [];
  if (compPengguna.length === 1) {
    const respon = await lokasiLabel(
      parameterBc,
      parameterBc.tabel_bc[`${compPengguna[0].toLowerCase()}`]
    );
    if (respon !== undefined && respon.length !== 0) {
      arrayLokasiLabel.push(respon);
      dispatch(setParameterLokasi(arrayLokasiLabel));
      dispatch(setLokasiInput([respon.map((item) => item.value)]));
    }
  } else {
    const lokasiLabelPromises = compPengguna.map(async (comp) => {
      const respon = await lokasiLabel(
        parameterBc,
        parameterBc.tabel_bc[`${comp.toLowerCase()}`]
      );
      if (respon !== undefined && respon.length !== 0) {
        return respon;
      }
    });

    const lokasiLabelJamak = await Promise.all(lokasiLabelPromises);
    const lokasiLabelValid = lokasiLabelJamak.filter(
      (hasil): hasil is DataMultiSelect[] => hasil !== undefined
    );
    arrayLokasiLabel.push(...lokasiLabelValid);
    dispatch(setParameterLokasi(arrayLokasiLabel));
    let arrLokasiComp: string[][] = [];
    for (var indeks in arrayLokasiLabel) {
      const arrLokasi: string[] = arrayLokasiLabel[indeks].map(
        (lokasi: DataMultiSelect) => lokasi.value
      );
      arrLokasiComp.push(arrLokasi);
    }
    dispatch(setLokasiInput(arrLokasiComp));
  }
};

const muatKlasifikasi = async (
  compPengguna: string[],
  parameterBc: { [key: string]: { [key: string]: string } },
  dispatch: any
) => {
  const respon = await klasifikasiLabel(
    parameterBc,
    parameterBc.tabel_bc[
      `${
        compPengguna.length === 1
          ? compPengguna[0].toLowerCase()
          : compPengguna[
              compPengguna.indexOf(parameterBc.comp.pnt)
            ].toLowerCase()
      }`
    ]
  );
  if (respon !== undefined && respon.length !== 0) {
    dispatch(setParameterKlasifikasi(respon));
    dispatch(
      setKlasifikasiInput(respon.map((item: DataMultiSelect) => item.value))
    );
  }
};

const muatRegion = async (
  compPengguna: string[],
  parameterBc: { [key: string]: { [key: string]: string } },
  dispatch: any
) => {
  const respon = await regionLabel(
    parameterBc,
    parameterBc.tabel_bc[
      `${
        compPengguna.length === 1
          ? compPengguna[0].toLowerCase()
          : compPengguna[
              compPengguna.indexOf(parameterBc.comp.pnt)
            ].toLowerCase()
      }`
    ]
  );
  if (respon !== undefined && respon.length !== 0) {
    dispatch(setParameterRegion(respon));
    dispatch(setRegionInput(respon.map((item: DataMultiSelect) => item.value)));
  }
};

export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  dispatch: any,
  nama: string,
  kataKunci: string,
  setNama: React.Dispatch<React.SetStateAction<string>>,
  setKataKunci: React.Dispatch<React.SetStateAction<string>>,
  koneksiBC: boolean,
  navigasi: NavigateFunction
) => {
  if (e.key === "Enter") {
    prosesLogin(
      dispatch,
      nama,
      kataKunci,
      setNama,
      setKataKunci,
      koneksiBC,
      navigasi
    );
  }
};

export const handleTutupAplikasi = async (dispatch: any) => {
  resetAplikasi(dispatch);
  appWindow.close();
};

export const prosesLogin = async (
  dispatch: any,
  nama: string,
  kataKunci: string,
  setNama: React.Dispatch<React.SetStateAction<string>>,
  setKataKunci: React.Dispatch<React.SetStateAction<string>>,
  koneksiBC: boolean,
  navigasi: NavigateFunction
) => {
  dispatch(setAuthGagal(false));
  dispatch(setProsesAuth(true));
  let respon: string;
  try {
    respon = await invoke("login", {
      nama: nama,
      kataKunci,
    });
  } catch (error) {
    console.error(error);
    dispatch(setProsesAuth(false));
    dispatch(setAuthGagal(true));
    setNama("");
    setKataKunci("");
    notifications.show({
      title: "Login Gagal",
      message: "Terjadi kesalahan saat melakukan koneksi ke mongodb.",
      autoClose: 5000,
      color: "red",
      icon: React.createElement(IconX, { size: "1.1rem" }),
      withCloseButton: false,
    });
    return;
  }

  let hasil = JSON.parse(respon);
  if (hasil.status && hasil.konten === "No User") {
    dispatch(setAuthGagal(true));
    setNama("");
    setKataKunci("");
    dispatch(setProsesAuth(false));
    notifications.show({
      title: "Login Gagal",
      message: `Nama Pengguna tidak terdaftar.`,
      autoClose: 5000,
      color: "red",
      icon: React.createElement(IconX, { size: "1.1rem" }),
      withCloseButton: false,
    });
  } else {
    const pengguna: Partial<PenggunaState> = {
      idPengguna: hasil.konten._id.$oid,
      namaPengguna: hasil.konten.nama,
      emailPengguna: hasil.konten.email,
      departemenPengguna: hasil.konten.departemen,
      peranPengguna: hasil.konten.peran,
      compPengguna: hasil.konten.comp,
    };
    dispatch(setAuthGagal(false));
    dispatch(setSesiAktif(true));
    dispatch(setIdPengguna(pengguna.idPengguna!));
    dispatch(setNamaPengguna(pengguna.namaPengguna!));
    dispatch(setEmailPengguna(pengguna.emailPengguna!));
    dispatch(setDepartemenPengguna(pengguna.departemenPengguna!));
    dispatch(setPeranPengguna(pengguna.peranPengguna!));
    dispatch(setCompPengguna(pengguna.compPengguna!));
    if (koneksiBC) {
      dispatch(setKonekKeBC(true));
      let parameterBc;
      // inisiasi data param BC
      try {
        const respon: string = await invoke("inisiasi_bc_ereport");
        parameterBc = JSON.parse(respon);
        if (parameterBc.status) {
          dispatch(setParameterBc(parameterBc.konten));
          if (pengguna.compPengguna!.length === 1) {
            dispatch(
              setCompKueri(
                parameterBc.konten.tabel_bc[
                  `${pengguna.compPengguna![0].toLowerCase()}`
                ]
              )
            );
          } else {
            dispatch(setIndeksData(0));
          }
          try {
            // inisiasi data brand
            await muatBrand(
              pengguna.compPengguna!,
              parameterBc.konten,
              dispatch
            );
            // inisiasi data mc
            await muatMC(pengguna.compPengguna!, parameterBc.konten, dispatch);
            // inisiasi data lokasi
            await muatLokasi(
              pengguna.compPengguna!,
              parameterBc.konten,
              dispatch
            );
            // inisiasi data SBU jika PRI
            if (
              (pengguna.compPengguna!.length === 1 &&
                pengguna.compPengguna![0] === parameterBc.konten.comp.pri) ||
              pengguna.compPengguna!.includes(parameterBc.konten.comp.pri)
            ) {
              let arraySBU: DataMultiSelect[] = [];
              parameterBc.konten.sbu.map((sbu: string) => {
                arraySBU.push({ label: sbu, value: sbu });
              });
              dispatch(setParameterSBU(arraySBU));
              dispatch(
                setSBUInput(arraySBU.map((item: DataMultiSelect) => item.value))
              );
            }
            // inisiasi data Klasifikasi & Region jika PNT
            if (
              (pengguna.compPengguna!.length === 1 &&
                pengguna.compPengguna![0] === parameterBc.konten.comp.pnt) ||
              pengguna.compPengguna!.includes(parameterBc.konten.comp.pnt)
            ) {
              await muatKlasifikasi(
                pengguna.compPengguna!,
                parameterBc.konten,
                dispatch
              );
              await muatRegion(
                pengguna.compPengguna!,
                parameterBc.konten,
                dispatch
              );
            }
          } catch (e) {
            resetAplikasi(dispatch);
            notifications.show({
              title: "Kesalahan",
              message: `Terjadi kesalahan dalam proses inisiasi data: [${e}]`,
              autoClose: 3000,
              color: "red",
              icon: React.createElement(IconX, { size: "1.1rem" }),
              withCloseButton: false,
            });
          }
        } else {
          console.log("Tidak terhubung ke BC.");
          return;
        }
      } catch (e) {
        console.log(`Gagal memuat parameter BC dari back-end. ${e}`);
      }
    } else {
      // Tidak terhubung ke BC
      dispatch(setKonekKeBC(false));
    }
    LogRocket.identify(nama, {
      name: pengguna.namaPengguna!,
      email: pengguna.emailPengguna!,
      departemen: pengguna.departemenPengguna!,
      peran: pengguna.peranPengguna!,
    });
    notifications.show({
      title: "Login Sukses",
      message: `Selamat datang kembali ${nama} di e-Report!`,
      autoClose: 5000,
      color: "teal",
      icon: React.createElement(IconCheck, { size: "1.1rem" }),
      withCloseButton: false,
    });
    dispatch(setProsesAuth(false));
    navigasi("konten");
  }
};
