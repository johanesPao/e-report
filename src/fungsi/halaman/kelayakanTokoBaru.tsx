import { invoke } from "@tauri-apps/api/tauri";
import {
  DataKelayakanTokoBaru,
  DataTabelKelayakanTokoBaru,
  EModeTeksOutputNewStore,
  EPlaceholderTeks,
  Formulir,
  IChatGPT,
  IChatGPTClient,
  IDisabilitasInputKelayakanTokoBaru,
  IInputItemKelayakanTokoBaru,
  IKotaKabupatenKueriChatGPT,
  IModelKelayakanTokoBaru,
  IPopUpProps,
  toTitle,
} from "../basic";
import { Text } from "@mantine/core";
import { setDataKelayakanTokoBaru } from "../../fitur_state/dataBank";
import { UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React from "react";
import { IconExclamationMark, IconX } from "@tabler/icons-react";

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
    listProvinsi: list_provinsi,
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

export const handlePerubahanKotaKabupaten = (
  nilai: string,
  formulir: UseFormReturnType<Formulir, (values: Formulir) => Formulir>
) => {
  // set nilai formulir.values.input.kota_kabupaten
  formulir.setFieldValue(
    "input.kota_kabupaten",
    nilai !== "" && nilai !== undefined ? toTitle(nilai) : ""
  );
};

export const handleKotaKabupatenHilangFokus = async (
  setMemuatChatGPT: React.Dispatch<React.SetStateAction<boolean>>,
  formulir: UseFormReturnType<Formulir, (values: Formulir) => Formulir>,
  chatGPT: IChatGPT,
  props: StateKelayakanTokoBaru,
  statusDisabilitasInput: IDisabilitasInputKelayakanTokoBaru,
  setStatusDisabilitasInput: React.Dispatch<
    React.SetStateAction<IDisabilitasInputKelayakanTokoBaru>
  >,
  initialValue: Formulir
) => {
  // jika kota_kabupaten kembali ke initial value
  if (
    formulir.values.input.kota_kabupaten === initialValue.input.kota_kabupaten
  ) {
    // set model sales 0
    formulir.setFieldValue(
      "output.model_generated.sales",
      initialValue.output.model_generated.sales
    );
    // reset value rentang populasi dan provinsi_umr
    formulir.setValues((stateSebelumnya) => ({
      ...stateSebelumnya,
      input: {
        ...stateSebelumnya.input,
        rentang_populasi: initialValue.input.rentang_populasi,
        provinsi_umr: initialValue.input.provinsi_umr,
      },
    }));
    // jika kota_kabupaten "" atau undefined
  } else if (
    formulir.values.input.kota_kabupaten === "" ||
    formulir.values.input.kota_kabupaten === undefined
  ) {
    // set rentang_populasi -1 dan provinsi_umr "DKI Jakarta"
    formulir.setValues((stateSebelumnya) => ({
      ...stateSebelumnya,
      input: {
        ...stateSebelumnya.input,
        rentang_populasi: -1,
        provinsi_umr: "Dki Jakarta",
      },
    }));
    // selain dua skenario di atas, lakukan evaluasi rentang_populasi dan provinsi_umr
  } else {
    // persingkat variabel
    const kotaKabupaten = formulir.values.input.kota_kabupaten;
    // cek jika input kota kabupaten tidak "" atau undefined
    if (kotaKabupaten !== "" && kotaKabupaten !== undefined) {
      // disable input model
      setStatusDisabilitasInput((stateSebelumnya) => ({
        ...stateSebelumnya,
        sbu: true,
        kelas_mall: true,
        luas_toko: true,
      }));
      // setMemuatChatGPT
      setMemuatChatGPT(true);
      // set placeholder role dan prompt chatgpt serta join list_provinsi
      const [list_provinsi, kueri] = rubahPlaceholderKueriChatGPT(
        //deep clone struktur objek chatGPT yang mengandung state
        structuredClone(chatGPT),
        kotaKabupaten,
        props,
        formulir
      );

      // kueri chatgpt untuk mendapatkan rentang populasi dan provinsi UMR
      const respon = await kueriChatGPT(
        kueri.klien,
        kueri.kueri,
        list_provinsi
      );

      // Jika status respon true
      if (respon.status) {
        // simplifikasi respon.konten.populasi_kota_kabupaten
        const pkk = respon.konten.populasi_kota_kabupaten;
        const prov_kk = respon.konten.provinsi_kota_kabupaten;
        // jika pkk.status true
        if (pkk.status) {
          // Cek jika input rentang populasi enabled, ubah menjadi disabled
          if (!statusDisabilitasInput.rentang_populasi) {
            setStatusDisabilitasInput((stateSebelumnya) => ({
              ...stateSebelumnya,
              rentang_populasi: true,
            }));
          }
          // parse respon.konten.populasi_kota_kabupaten.konten menjadi int
          const populasi = parseInt(pkk.konten.replaceAll(/[.,]/g, ""));
          // Evaluasi populasi terhadap rentangPopulasiItem.label
          let nilaiRentangPopulasi = props.inputItem.rentangPopulasiItem
            .map(({ label, value }) => {
              // split label berdasar spasi dan ambil array terakhir dari hasil split dan parseInt
              const ekstrakLabelRentangPopulasi = label
                .split(" ")
                .pop()
                ?.replaceAll(".", "");
              let batasAtasRentangPopulasi: number;
              if (ekstrakLabelRentangPopulasi != undefined) {
                batasAtasRentangPopulasi = parseInt(
                  ekstrakLabelRentangPopulasi
                );
                // evaluasi nilai populasi
                // jika value sama dengan props.inputItem.rentangPopulasiItem.length - 1
                // maka kita sudah mencapai elemen array terakhir, kembalikan nilai value
                if (value === props.inputItem.rentangPopulasiItem.length - 1) {
                  return value;
                } else {
                  if (populasi <= batasAtasRentangPopulasi) {
                    return value;
                  }
                }
              }
              return undefined;
              // kembalikan angka pertama yang bukan undefined
            })
            .find((angka) => angka != undefined);
          // set formulir.setValues untuk rentang_populasi
          if (typeof nilaiRentangPopulasi === "number") {
            formulir.setFieldValue(
              "input.rentang_populasi",
              nilaiRentangPopulasi * 20
            );
          } else {
            console.log("nilaiRentangPopulasi bukan angka");
          }
          // jika pkk.status false
        } else {
          // notifikasi bahwa chatGPT tidak dapat menemukan populasi untuk kota kabupaten
          notifications.show({
            title: "ChatGPT Error",
            message: `ChatGPT tidak berhasil menemukan populasi untuk kota/kabupaten ${
              formulir.getInputProps("input.kota_kabupaten").value
            }`,
            autoClose: false,
            color: "red",
            icon: <IconX />,
            withCloseButton: true,
          });
          notifications.show({
            title: "Status Input Rentang Populasi",
            message:
              "Input untuk Rentang Populasi akan dibuka, silahkan edit dan pilih nilai rentang populasi yang sesuai dengan kota/kabupaten yang anda input",
            autoClose: false,
            color: "yellow",
            icon: <IconExclamationMark />,
            withCloseButton: true,
          });
          // enable rentang_populasi
          if (statusDisabilitasInput.rentang_populasi) {
            setStatusDisabilitasInput((stateSebelumnya) => ({
              ...stateSebelumnya,
              rentang_populasi: false,
            }));
          }
        }
        // jika prov_kk.status true
        if (prov_kk.status) {
          // set disabled provinsi_umr
          if (!statusDisabilitasInput.provinsi_umr) {
            setStatusDisabilitasInput((stateSebelumnya) => ({
              ...stateSebelumnya,
              provinsi_umr: true,
            }));
          }
          // set nilai formulir.input.provinsi_umr
          formulir.setFieldValue("input.provinsi_umr", prov_kk.konten);
        } else {
          // jika prov_kk.status false
          // notifikasi bahwa chatGPT tidak dapat menemukan provinsi untuk kota kabupaten
          notifications.show({
            title: "ChatGPT Error",
            message: `ChatGPT tidak berhasil menemukan provinsi untuk kota/kabupaten ${
              formulir.getInputProps("input.kota_kabupaten").value
            }`,
            autoClose: false,
            color: "red",
            icon: <IconX />,
            withCloseButton: true,
          });
          notifications.show({
            title: "Status Input Provinsi UMR",
            message:
              "Input untuk Provinsi UMR akan dibuka, silahkan edit dan pilih nilai provinsi yang sesuai dengan kota/kabupaten yang anda input",
            autoClose: false,
            color: "yellow",
            icon: <IconExclamationMark />,
            withCloseButton: true,
          });
          // set enabled provinsi_umr
          if (statusDisabilitasInput.provinsi_umr) {
            setStatusDisabilitasInput((stateSebelumnya) => ({
              ...stateSebelumnya,
              provinsi_umr: false,
            }));
          }
        }
      } else {
        notifications.show({
          title: "ChatGPT Error",
          message: `ChatGPT tidak berhasil menemukan kota/kabupaten ${
            formulir.getInputProps("input.kota_kabupaten").value
          }`,
          autoClose: false,
          color: "red",
          icon: <IconX />,
          withCloseButton: true,
        });
        notifications.show({
          title: "Status Input Rentang Populasi dan Provinsi UMR",
          message:
            "Input untuk Rentang Populasi dan Provinsi UMR akan dibuka, silahkan edit dan pilih nilai rentang populasi dan provinsi yang sesuai dengan kota kabupaten yang anda input",
          autoClose: false,
          color: "yellow",
          icon: <IconExclamationMark />,
          withCloseButton: true,
        });
        setStatusDisabilitasInput((stateSebelumnya) => ({
          ...stateSebelumnya,
          rentang_populasi: false,
          provinsi_umr: false,
        }));
      }
      // clear setMemuatChatGPT
      setMemuatChatGPT(false);
      // enable input model
      setStatusDisabilitasInput((stateSebelumnya) => ({
        ...stateSebelumnya,
        sbu: false,
        kelas_mall: false,
        luas_toko: false,
      }));
      // cek input model
      monitorInputPrediksiModel(formulir, props);
      // console.log(formulir.getInputProps("input.kota_kabupaten").value);
    } else {
      // nilai kota_kabupaten = "" atau undefined
      // set rentang_populasi ke 0
      formulir.setFieldValue("input.rentang_populasi", 0);
      // set provinsi_umr ke "DKI Jakarta"
      formulir.setFieldValue("input.provinsi_umr", "DKI Jakarta");
      return;
    }
  }
};

const preprocessingModelInput = (
  formulir: UseFormReturnType<Formulir, (values: Formulir) => Formulir>,
  props: StateKelayakanTokoBaru
) => {
  const sqmScaled =
    formulir.values.input.luas_toko !== undefined &&
    (formulir.values.input.luas_toko - parseFloat(props.inputItem.model.mean)) /
      parseFloat(props.inputItem.model.std);
  const instances = [
    sqmScaled,
    formulir.values.input.sbu === props.inputItem.sbuItem[0] ? 1 : 0,
    formulir.values.input.sbu === props.inputItem.sbuItem[1] ? 1 : 0,
    formulir.values.input.sbu === props.inputItem.sbuItem[2] ? 1 : 0,
    formulir.values.input.kelas_mall !== undefined &&
      formulir.values.input.kelas_mall - 1,
    formulir.values.input.rentang_populasi !== undefined &&
      (formulir.values.input.rentang_populasi === 0
        ? 0
        : formulir.values.input.rentang_populasi / 20),
  ];
  return instances;
};

// fungsi async rekues prediksi model
const prediksi = async (
  arrayInput: (number | false)[],
  modelEndpoint: string
) => {
  const respon: string = await invoke("prediksi_penjualan_toko_baru", {
    instance: arrayInput,
    modelUrl: modelEndpoint,
  });
  return JSON.parse(respon);
};

export const monitorInputPrediksiModel = async (
  formulir: UseFormReturnType<Formulir, (values: Formulir) => Formulir>,
  props: StateKelayakanTokoBaru
) => {
  if (
    formulir.values.input.sbu === "" ||
    formulir.values.input.rentang_populasi === -1 ||
    formulir.values.input.kelas_mall === 0 ||
    // jika luas_toko = undefined atau ""
    typeof formulir.values.input.luas_toko !== "number"
  ) {
    // set sales model 0
    formulir.setFieldValue("output.model_generated.sales", 0);
  } else {
    // lakukan prediksi model
    // konversi nilai - nilai input sesuai dengan input untuk model (preprocessing input)
    const input = preprocessingModelInput(formulir, props);
    // konstruksi endpoint model
    const modelUrl = props.inputItem.model.namaModelUrl.replace(
      "{versi}",
      props.inputItem.model.versi
    );
    const hasilPrediksi = await prediksi(input, modelUrl);
    if (hasilPrediksi.status) {
      // status true
      // RegExp konten
      const regex_prediksi = /[0-9\.e+]+[0-9\.e+]+/g;
      const prediksi = hasilPrediksi.konten.match(regex_prediksi);
      if (prediksi !== null) {
        // cek jika angka memiliki notasi eksponensial
        const e_regex = /[e]/g;
        formulir.setFieldValue(
          "output.model_generated.sales",
          prediksi[0].match(e_regex) !== null
            ? parseFloat(Number(prediksi[0]).toPrecision())
            : parseFloat(prediksi[0])
        );
      } else {
        console.log(
          "Tidak dapat menemukan nilai prediksi dalam prediksi.konten"
        );
      }
    } else {
      // status false
      console.log("Gagal melakukan prediksi sales dari tensorflow serving");
    }
  }
};

export const kalkulasiStoreIncome = (
  formulir: UseFormReturnType<Formulir, (values: Formulir) => Formulir>,
  props: StateKelayakanTokoBaru
) => {
  // Fungsi Kalkulasi
  // PPN
  const kalkulasiPPN = (sales: number, ppnRate: number) => {
    return sales * ppnRate;
  };
  // COGS
  const kalkulasiCOGS = (sales: number, marginRate: number) => {
    return sales * (1 - marginRate);
  };
  // Staff Expense
  const kalkulasiStaffExp = (umr: number, jumlahStaff: number) => {
    return umr * jumlahStaff;
  };
  // Office and Utility Expense
  const kalkulasiOAUExp = (oauRate: number, grossProfit: number) => {
    return oauRate * grossProfit;
  };
  // Amortisasi Rental Expense
  const kalkulasiRentalExp = (jumlahTahun: number, biayaSewaTotal: number) => {
    return biayaSewaTotal / (jumlahTahun * 12);
  };
  // Amortisasi Fitout Expense
  const kalkulasiFitoutExp = (
    biayaFitoutTotal: number,
    jumlahBulanAmortisasi: number = 48
  ) => {
    return biayaFitoutTotal / jumlahBulanAmortisasi;
  };

  // Shortcut
  const input = formulir.values.input;
  // Nilai Input
  const inputPPNRate = input.ppn ? input.ppn : 0;
  const inputMargin = input.margin_penjualan ? input.margin_penjualan : 0;
  const inputOAURate = input.biaya_oau ? input.biaya_oau : 0;
  const inputJumlahStaff = input.jumlah_staff ? input.jumlah_staff : 0;
  const inputLamaSewa = input.lama_sewa ? input.lama_sewa : 0;
  const inputBiayaSewaTotal = input.biaya_sewa ? input.biaya_sewa : 0;
  const inputBiayaFitoutTotal = input.biaya_fitout ? input.biaya_fitout : 0;

  // Index umrItem berdasar tahun_data sesuai dengan formulir.values.input.tahun_umr
  const indeksTahunUMR = props.inputItem.umrItem.findIndex((dataUMR) => {
    return dataUMR.tahun_data == parseInt(formulir.values.input.tahun_umr!);
  });
  // Index data provinsi_umr berdasar indeks tahun_data dan formulir.values.input.provinsi_umr
  const indeksProvinsiUMR = props.inputItem.umrItem[
    indeksTahunUMR
  ].data.findIndex((dataProvinsiUMR) => {
    return dataProvinsiUMR.label == formulir.values.input.provinsi_umr;
  });
  // Ambil nilai umr berdasar index data tahun umr dan provinsi umr di formulir.values.input.provinsu_umr
  const inputUMR = props.inputItem.umrItem[indeksTahunUMR].data[
    indeksProvinsiUMR
  ].value as number;

  // Global Expense
  const StaffExpense = kalkulasiStaffExp(inputUMR, inputJumlahStaff);
  const RentalExpense = kalkulasiRentalExp(inputLamaSewa, inputBiayaSewaTotal);
  const FitoutExpense = kalkulasiFitoutExp(inputBiayaFitoutTotal);
  const GlobalExpense = StaffExpense + RentalExpense + FitoutExpense;

  // User Generated Related Sales and Cost
  const ug = formulir.values.output.user_generated;
  const ugSales = ug.sales ? ug.sales : 0;
  const ugPPN = kalkulasiPPN(ugSales, inputPPNRate);
  const ugNetSales = ugSales - ugPPN;
  const ugCOGS = kalkulasiCOGS(ugSales, inputMargin);
  const ugGrossProfit = ugNetSales - ugCOGS;
  const ugOAUExpense = kalkulasiOAUExp(inputOAURate, ugGrossProfit);
  const ugStoreIncome = ugGrossProfit - (ugOAUExpense + GlobalExpense);

  // Model Generated Related Sales and Cost
  const mg = formulir.values.output.model_generated;
  const mgSales = mg.sales ? mg.sales : 0;
  const mgPPN = kalkulasiPPN(mgSales, inputPPNRate);
  const mgNetSales = mgSales - mgPPN;
  const mgCOGS = kalkulasiCOGS(mgSales, inputMargin);
  const mgGrossProfit = mgNetSales - mgCOGS;
  const mgOAUExpense = kalkulasiOAUExp(inputOAURate, mgGrossProfit);
  const mgStoreIncome = mgGrossProfit - (mgOAUExpense + GlobalExpense);

  formulir.setValues((stateSebelumnya) => ({
    ...stateSebelumnya,
    output: {
      user_generated: {
        ...stateSebelumnya.output!.user_generated,
        ppn: ugPPN,
        net_sales: ugNetSales,
        cogs: ugCOGS,
        gross_profit: ugGrossProfit,
        staff_expense: StaffExpense,
        oau_expense: ugOAUExpense,
        rental_expense: RentalExpense,
        fitout_expense: FitoutExpense,
        store_income: ugStoreIncome,
      },
      model_generated: {
        ...stateSebelumnya.output!.model_generated,
        ppn: mgPPN,
        net_sales: mgNetSales,
        cogs: mgCOGS,
        gross_profit: mgGrossProfit,
        staff_expense: StaffExpense,
        oau_expense: mgOAUExpense,
        rental_expense: RentalExpense,
        fitout_expense: FitoutExpense,
        store_income: mgStoreIncome,
      },
    },
  }));
};

// fungsi render format teks output
export const renderOutput = (
  nilaiOutput: number,
  mode: EModeTeksOutputNewStore
) => {
  let warna: string;
  switch (mode) {
    case EModeTeksOutputNewStore.EXPENSE:
      if (nilaiOutput >= 0) {
        warna = "red";
      } else {
        warna = "green";
      }
      break;
    case EModeTeksOutputNewStore.INCOME:
      if (nilaiOutput >= 0) {
        warna = "green";
      } else {
        warna = "red";
      }
      break;
    default:
      return;
  }
  return (
    <Text c={warna} ta="center">
      {`Rp ${nilaiOutput.toLocaleString("id-ID", {
        maximumFractionDigits: 0,
      })}`}
    </Text>
  );
};
