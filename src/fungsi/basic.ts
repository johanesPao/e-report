import {
  setParameterBc,
  setParameterBrand,
  setParameterCat,
  setParameterDiv,
  setParameterGroup,
  setParameterKlasifikasi,
  setParameterLokasi,
  setParameterRegion,
  setParameterSBU,
} from "../fitur_state/dataParam";
import {
  setHalaman,
  setIndeksData,
  setKonekKeBC,
  setSesiAktif,
} from "../fitur_state/event";
import {
  setCompKueri,
  setCompPengguna,
  setDepartemenPengguna,
  setEmailPengguna,
  setNamaPengguna,
  setPeranPengguna,
} from "../fitur_state/pengguna";

export const toTitle = (kalimat: string) => {
  return kalimat
    .toLowerCase()
    .split(" ")
    .map((kata) => {
      return kata.replace(kata[0], kata[0].toUpperCase());
    })
    .join(" ");
};

export const resetAplikasi = (dispatch: any) => {
  dispatch(setSesiAktif(false));
  dispatch(setNamaPengguna(""));
  dispatch(setEmailPengguna(""));
  dispatch(setDepartemenPengguna(""));
  dispatch(setPeranPengguna(""));
  dispatch(setKonekKeBC(false));
  dispatch(setHalaman("dashboard"));
  dispatch(setCompPengguna([]));
  dispatch(setCompKueri(""));
  dispatch(setParameterBc({}));
  dispatch(setParameterBrand([]));
  dispatch(setIndeksData(0));
  dispatch(setParameterDiv([]));
  dispatch(setParameterGroup([]));
  dispatch(setParameterCat([]));
  dispatch(setParameterSBU([]));
  dispatch(setParameterLokasi([]));
  dispatch(setParameterKlasifikasi([]));
  dispatch(setParameterRegion([]));
};
