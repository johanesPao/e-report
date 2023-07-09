import { invoke } from "@tauri-apps/api/tauri";
import {
  DataKelayakanTokoBaru,
  DataTabelKelayakanTokoBaru,
  IInputItemKelayakanTokoBaru,
  IPopUpProps,
} from "../basic";
import { setDataKelayakanTokoBaru } from "../../fitur_state/dataBank";

export interface StateKelayakanTokoBaru {
  tampilanTabel: DataTabelKelayakanTokoBaru[];
  dataKelayakanTokoBaru: DataKelayakanTokoBaru[];
  muatTabelKelayakanTokoBaru: boolean;
  popUp: IPopUpProps;
  inputItem: IInputItemKelayakanTokoBaru | undefined;
}

export const ambilInputItemKelayakanTokoBaru = async (
  setProps: React.Dispatch<React.SetStateAction<StateKelayakanTokoBaru>>
) => {
  const respon: string = await invoke("ambil_input_item_kelayakan_toko_baru");
  const hasil = JSON.parse(respon);

  if (hasil) {
    const inputItem: IInputItemKelayakanTokoBaru = {
      sbuItem: hasil.sbu_item,
      rentangPopulasiItem: hasil.rentang_populasi_item,
      kelasMallItem: hasil.kelas_mall_item,
      umrItem: hasil.umr_item,
    };
    setProps((stateSebelumnya) => ({
      ...stateSebelumnya,
      inputItem,
    }));
  }
};

export const ambilProposal = async (
  dispatch: any,
  setProps: React.Dispatch<React.SetStateAction<StateKelayakanTokoBaru>>
) => {
  setProps((stateSebelumnya) => ({
    ...stateSebelumnya,
    muatTabelKelayakanTokoBaru: true,
  }));
  const respon: string = await invoke("ambil_semua_proposal_toko_baru");
  const hasil = JSON.parse(respon);

  if (hasil.length > 0) {
    // simpan data full proposal
    dispatch(setDataKelayakanTokoBaru(hasil));
    // unik proposal
    let proposalList: string[] = [];
    for (let hitung = 0; hitung < hasil.length; hitung++) {
      proposalList.push(hasil[hitung].proposal_id);
    }
    const unikProposal = [...new Set<string>(proposalList)];

    // ekstrak dan transform data untuk tampilan tabel
    let proposalTabelData: DataTabelKelayakanTokoBaru[] = [];
    for (var proposal of unikProposal) {
      let listVersiProposal: number[] = [];
      for (var proposalSaatIni of hasil) {
        proposalSaatIni.proposal_id === proposal &&
          listVersiProposal.push(proposalSaatIni.versi);
      }
      const versiMaxProposal = Math.max(...listVersiProposal);
      const proposalTampilan = hasil.filter(
        (item: any) =>
          item.proposal_id === proposal && item.versi === versiMaxProposal
      );
      const proposalData: DataTabelKelayakanTokoBaru = {
        proposal_id: proposalTampilan[0].proposal_id,
        versi: proposalTampilan[0].versi,
        sbu: proposalTampilan[0].data.input.sbu,
        kota_kabupaten: proposalTampilan[0].data.input.kota_kabupaten,
        kelas_mall: proposalTampilan[0].data.input.kelas_mall,
        luas_toko: proposalTampilan[0].data.input.luas_toko,
        user_generated_store_income:
          proposalTampilan[0].data.output.user_generated.store_income,
        model_generated_store_income:
          proposalTampilan[0].data.output.model_generated.store_income,
        submit_by: proposalTampilan[0].data.pengguna,
        dibuat: new Date(
          parseInt(proposalTampilan[0].data.dibuat.$date.$numberLong)
        ),
        diedit: new Date(
          parseInt(proposalTampilan[0].data.diedit.$date.$numberLong)
        ),
        status: proposalTampilan[0].data.status,
      };
      proposalTabelData.push(proposalData);
    }
    setProps((stateSebelumnya) => ({
      ...stateSebelumnya,
      tampilanTabel: proposalTabelData,
    }));
  }
  setProps((stateSebelumnya) => ({
    ...stateSebelumnya,
    muatTabelKelayakanTokoBaru: false,
  }));
};
