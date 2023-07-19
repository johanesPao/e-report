import { invoke } from "@tauri-apps/api/tauri";
import {
  DataKelayakanTokoBaru,
  DataTabelKelayakanTokoBaru,
  EPlaceholderTeks,
  Formulir,
  IChatGPT,
  IChatGPTClient,
  IInputItemKelayakanTokoBaru,
  IKotaKabupatenKueriChatGPT,
  IModelKelayakanTokoBaru,
  IPopUpProps,
} from "../basic";
import { setDataKelayakanTokoBaru } from "../../fitur_state/dataBank";
import { UseFormReturnType } from "@mantine/form";

export interface StateKelayakanTokoBaru {
  tampilanTabel: DataTabelKelayakanTokoBaru[];
  dataKelayakanTokoBaru: DataKelayakanTokoBaru[];
  muatTabelKelayakanTokoBaru: boolean;
  popUp: IPopUpProps;
  inputItem: IInputItemKelayakanTokoBaru;
}

export const ambilInputItemModelKelayakanTokoBaru = async (
  setProps: React.Dispatch<React.SetStateAction<StateKelayakanTokoBaru>>
) => {
  const respon: string = await invoke(
    "ambil_input_item_model_kelayakan_toko_baru"
  );
  const hasil = JSON.parse(respon);

  if (hasil) {
    const model: IModelKelayakanTokoBaru = {
      namaModelUrl: hasil.model.nama_model_url,
      namaModel: hasil.model.nama_model,
      versi: hasil.model.versi,
      mean: hasil.model.mean,
      std: hasil.model.std,
    };
    const inputItem: IInputItemKelayakanTokoBaru = {
      sbuItem: hasil.sbu_item,
      rentangPopulasiItem: hasil.rentang_populasi_item,
      kelasMallItem: hasil.kelas_mall_item,
      umrItem: hasil.umr_item,
      model,
    };
    setProps((stateSebelumnya) => ({
      ...stateSebelumnya,
      inputItem,
    }));
  }
};

export const generateProposalID = (props: StateKelayakanTokoBaru) => {
  // dua digit tahun proposal dibuat
  const tahun = new Date().getFullYear() % 100;
  // prefix proposal
  const prefixProposal = "NS" + tahun;
  // filter props.tampilanTabel berdasar prefix
  let listProposal: number[] = [];
  props.tampilanTabel.filter((item) => {
    if (item.proposal_id.includes(prefixProposal)) {
      listProposal.push(parseInt(item.proposal_id.split(prefixProposal)[1]));
    }
  });
  // proposal ID selanjutnya
  const proposalIdSelanjutnya = `${
    prefixProposal + (Math.max(...listProposal) + 1).toString().padStart(3, "0")
  }`;

  return proposalIdSelanjutnya;
};

export const prosesSimpanKelayakanTokoBaru = (
  formulir: UseFormReturnType<Formulir, (values: Formulir) => Formulir>
) => {
  console.log(formulir);
};

// fungsi untuk mereplace placeholder role dan content dari chatGPT kueri
export const rubahPlaceholderKueriChatGPT = (
  chatGPT: IChatGPT, // deep clone IChatGPT yang mengandung state
  kotaKabupaten: string,
  props: StateKelayakanTokoBaru,
  formulir: UseFormReturnType<Formulir, (values: Formulir) => Formulir>
) => {
  // join array provinsi berdasar indeks tahun umr pada props.inputItem.umrItem
  const listProvinsi = props.inputItem.umrItem[
    props.inputItem.umrItem.findIndex((objek) => {
      return objek.tahun_data.toString() === formulir.values.input.tahun_umr;
    })
  ].data.map((objek) => objek.label);

  // set placeholder role dan prompt chatgpt
  chatGPT.kueri.kota_eksis.prompt.content =
    chatGPT.kueri.kota_eksis.prompt.content.replace(
      EPlaceholderTeks.NAMA_KOTA_GPT,
      kotaKabupaten
    );
  chatGPT.kueri.populasi_kota_kabupaten.prompt.content =
    chatGPT.kueri.populasi_kota_kabupaten.prompt.content.replace(
      EPlaceholderTeks.NAMA_KOTA_GPT,
      kotaKabupaten
    );
  chatGPT.kueri.provinsi_kota_kabupaten.role[0].content =
    chatGPT.kueri.provinsi_kota_kabupaten.role[0].content.replace(
      EPlaceholderTeks.LIST_PROVINSI_GPT,
      listProvinsi.join(", ")
    );
  chatGPT.kueri.provinsi_kota_kabupaten.prompt.content =
    chatGPT.kueri.provinsi_kota_kabupaten.prompt.content.replace(
      EPlaceholderTeks.NAMA_KOTA_GPT,
      kotaKabupaten
    );

  return [listProvinsi, chatGPT] as const;
};

// fungsi untuk memanggil chatgpt dan melakukan pengaturan beberapa input
// jika chatgpt mengembalikan hasil
export const kueriChatGPT = async (
  klienChatGPT: IChatGPTClient,
  kueri: IKotaKabupatenKueriChatGPT,
  list_provinsi: string[]
) => {
  const respon: string = await invoke("kueri_kota_kabupaten_chatgpt", {
    klienKonfig: klienChatGPT,
    kueri: kueri,
    list_provinsi: list_provinsi,
  });
  const hasil = JSON.parse(respon);

  if (hasil) {
    return hasil;
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
