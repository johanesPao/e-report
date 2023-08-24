import { invoke } from "@tauri-apps/api/tauri";
import {
  DataKelayakanTokoBaru,
  DataTabelKelayakanTokoBaru,
  EKelasMallProposalToko,
  EKelasMallStringProposalToko,
  EModePopUpKelayakanTokoBaru,
  EModeTeksOutputNewStore,
  EPlaceholderTeks,
  EStatusProposalTokoBaru,
  ETindakanProposalTokoBaru,
  Formulir,
  IAksenWarnaPopUp,
  IChatGPT,
  IChatGPTClient,
  IDataInputItemKelayakanTokoBaru,
  IDisabilitasInputKelayakanTokoBaru,
  IInputItemKelayakanTokoBaru,
  IKotaKabupatenKueriChatGPT,
  IModelKelayakanTokoBaru,
  IProposalToko,
  TLabelValueInputItem,
  toTitle,
} from "../basic";
import {
  Button,
  Group,
  Modal,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { setDataKelayakanTokoBaru } from "../../fitur_state/dataBank";
import { UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconExclamationMark, IconX } from "@tabler/icons-react";
import { StatePopUp } from "../../komponen/PopUp";

export interface StateKelayakanTokoBaru {
  tampilanTabel: DataTabelKelayakanTokoBaru[];
  dataKelayakanTokoBaru: DataKelayakanTokoBaru[];
  muatTabelKelayakanTokoBaru: boolean;
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

export const cekFormValid = (
  formulir: UseFormReturnType<Formulir, (values: Formulir) => Formulir>
) => {
  // shortcut formulir
  const nilai = formulir.values;
  const nilaiInput = nilai.input;
  const nilaiOutputUser = nilai.output.user_generated;
  const nilaiOutputModel = nilai.output.model_generated;
  // Cek Field yang dibutuhkan
  return (
    // cek nilai input
    nilai.proposal_id !== "" &&
    nilai.versi_proposal !== "" &&
    nilaiInput.nama_model !== "" &&
    nilaiInput.versi_model !== "" &&
    nilaiInput.sbu !== "" &&
    nilaiInput.kota_kabupaten !== "" &&
    nilaiInput.rentang_populasi !== -1 &&
    nilaiInput.kelas_mall !== 0 &&
    nilaiInput.luas_toko !== undefined &&
    nilaiInput.luas_toko > 0 &&
    nilaiInput.margin_penjualan !== undefined &&
    nilaiInput.margin_penjualan > 0 &&
    nilaiInput.ppn !== undefined &&
    nilaiInput.ppn > 0 &&
    nilaiInput.tahun_umr !== "" &&
    nilaiInput.provinsi_umr !== "" &&
    nilaiInput.jumlah_staff !== undefined &&
    nilaiInput.jumlah_staff > 0 &&
    nilaiInput.biaya_oau !== undefined &&
    nilaiInput.biaya_oau > 0 &&
    nilaiInput.biaya_sewa !== undefined &&
    nilaiInput.biaya_sewa > 0 &&
    nilaiInput.lama_sewa !== undefined &&
    nilaiInput.lama_sewa > 0 &&
    nilaiInput.biaya_fitout !== undefined &&
    nilaiInput.biaya_fitout > 0 &&
    // cek hanya nilai output langsung yang bukan merupakan turunan
    nilaiOutputUser.sales !== 0 &&
    nilaiOutputUser.vat !== 0 &&
    nilaiOutputUser.cogs !== 0 &&
    nilaiOutputUser.staff_expense !== 0 &&
    nilaiOutputUser.oau_expense !== 0 &&
    nilaiOutputUser.rental_expense !== 0 &&
    nilaiOutputUser.fitout_expense !== 0 &&
    nilaiOutputModel.sales !== 0 &&
    nilaiOutputModel.vat !== 0 &&
    nilaiOutputModel.cogs !== 0 &&
    nilaiOutputModel.staff_expense !== 0 &&
    nilaiOutputModel.oau_expense !== 0 &&
    nilaiOutputModel.rental_expense !== 0 &&
    nilaiOutputModel.fitout_expense !== 0
  );
};

export const KonfirmasiProposal = (
  konfirmasiPopUp: boolean,
  setKonfirmasiPopUp: React.Dispatch<React.SetStateAction<boolean>>,
  valid: boolean,
  formulir: UseFormReturnType<Formulir, (values: Formulir) => Formulir>,
  aksenWarna: IAksenWarnaPopUp,
  props: StateKelayakanTokoBaru,
  tindakanProposal: ETindakanProposalTokoBaru,
  pengguna: string,
  popUp: StatePopUp,
  setPopUp: React.Dispatch<React.SetStateAction<StatePopUp>>
) => {
  // Jika terdapat kesalahan, ubah aksenWarna
  if (!valid) {
    const theme = useMantineTheme();
    aksenWarna = {
      ...aksenWarna,
      header: theme.colors.red[9],
    };
  }

  // Jika formulir valid, map input output dengan interface IProposalToko
  let proposalToko: IProposalToko = {} as IProposalToko;
  if (valid) {
    // shortcut
    const form = formulir.values;
    const input = form.input;
    const user = form.output.user_generated;
    const model = form.output.model_generated;
    // mapping status tindakan
    let status: EStatusProposalTokoBaru = EStatusProposalTokoBaru.DRAFT;
    switch (tindakanProposal) {
      case ETindakanProposalTokoBaru.SIMPAN:
        status = EStatusProposalTokoBaru.DRAFT;
        break;
      case ETindakanProposalTokoBaru.KIRIM:
        status = EStatusProposalTokoBaru.SUBMIT;
        break;
      case ETindakanProposalTokoBaru.DITOLAK:
        status = EStatusProposalTokoBaru.DITOLAK;
        break;
      case ETindakanProposalTokoBaru.DITERIMA:
        status = EStatusProposalTokoBaru.DITERIMA;
        break;
      default:
        break;
    }
    // mapping kelas_mall ke dalam string
    let kelas_mall: EKelasMallStringProposalToko =
      EKelasMallStringProposalToko["Mall Kelas 1"];
    switch (input.kelas_mall) {
      case EKelasMallProposalToko["Mall Kelas 1"]:
        kelas_mall = EKelasMallStringProposalToko["Mall Kelas 1"];
        break;
      case EKelasMallProposalToko["Mall Kelas 2"]:
        kelas_mall = EKelasMallStringProposalToko["Mall Kelas 2"];
        break;
      case EKelasMallProposalToko["Mall Kelas 3"]:
        kelas_mall = EKelasMallStringProposalToko["Mall Kelas 3"];
        break;
      case EKelasMallProposalToko["Mall Kelas 4/Non Mall"]:
        kelas_mall = EKelasMallStringProposalToko["Mall Kelas 4/Non Mall"];
        break;
      default:
        break;
    }
    // map input output dengan interface IProposalToko
    proposalToko = {
      proposal_id: form.proposal_id,
      versi: parseInt(form.versi_proposal),
      data: {
        input: {
          nama_model: input.nama_model!,
          versi_model: input.versi_model!,
          sbu: input.sbu!,
          kota_kabupaten: input.kota_kabupaten!,
          rentang_populasi:
            props.inputItem.rentangPopulasiItem[input.rentang_populasi! / 20]
              .label,
          kelas_mall,
          luas_toko: input.luas_toko!,
          prediksi_model: model.sales!,
          prediksi_user: user.sales!,
          margin_penjualan: input.margin_penjualan!,
          ppn: input.ppn!,
          tahun_umr: parseInt(input.tahun_umr!),
          provinsi_umr: input.provinsi_umr!,
          jumlah_staff: input.jumlah_staff!,
          biaya_atk_utilitas: input.biaya_oau!,
          biaya_sewa: input.biaya_sewa!,
          lama_sewa: input.lama_sewa!,
          biaya_fitout: input.biaya_fitout!,
        },
        output: {
          user_generated: {
            vat: user.vat,
            net_sales: user.net_sales,
            cogs: user.cogs,
            gross_profit: user.gross_profit,
            staff_expense: user.staff_expense,
            oau_expense: user.oau_expense,
            rental_expense: user.rental_expense,
            fitout_expense: user.fitout_expense,
            store_income: user.store_income,
          },
          model_generated: {
            vat: model.vat,
            net_sales: model.net_sales,
            cogs: model.cogs,
            gross_profit: model.gross_profit,
            staff_expense: model.staff_expense,
            oau_expense: model.oau_expense,
            rental_expense: model.rental_expense,
            fitout_expense: model.fitout_expense,
            store_income: model.store_income,
          },
        },
        log_output: [],
        remark: {
          konten: form.remark,
        },
        dibuat:
          popUp.modeProposal === EModePopUpKelayakanTokoBaru.PENAMBAHAN
            ? new Date().toISOString()
            : props.dataKelayakanTokoBaru[0].data.dibuat.toISOString(),
        diedit: new Date().toISOString(),
        pengguna: pengguna,
        status,
      },
    };
    console.log(proposalToko);
  }

  // Konten PopUp Formulir tidak valid
  const TidakValid = (
    setKonfirmasiPopUp: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return (
      <>
        <Group>
          Terdapat kesalahan pada pengisian data formulir, mohon pastikan
          kembali data yang anda isi.
        </Group>
        <Group grow>
          <Button mt="md" onClick={() => setKonfirmasiPopUp(false)}>
            Oke
          </Button>
        </Group>
      </>
    );
  };

  // Konten PopUp Formulir valid
  const RenderKonfirmasi = (
    setKonfirmasiPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    proposal: IProposalToko
  ) => {
    return (
      <>
        <Group>
          Anda akan menambahkan data proposal {formulir.values.proposal_id}
        </Group>
        <Group grow mt="md">
          <Button onClick={() => simpanProposal(proposal)}>Lanjutkan</Button>
          <Button onClick={() => setKonfirmasiPopUp(false)}>Batal</Button>
        </Group>
      </>
    );
  };

  // Tulis dokumen ke database mongo
  const simpanProposal = async (proposal: IProposalToko) => {
    const respon: string = await invoke("simpan_proposal_toko_baru", {
      proposal,
    });
    const hasil = JSON.parse(respon);
    // Tutup popup konfirmasi
    setKonfirmasiPopUp(false);
    if (hasil.status) {
      // Tutup formulir
      setPopUp((stateSebelumnya) => ({
        ...stateSebelumnya,
        togglePopUp: false,
      }));
      // Beritahukan pengguna bahwa dokumen berhasil disimpan
      notifications.show({
        title: "Sukses",
        message: `Proposal toko dengan Proposal ID ${
          proposal.proposal_id
        } versi ${proposal.versi} berhasil ditambahkan sebagai  ${
          proposal.data.status === EStatusProposalTokoBaru.DRAFT
            ? `DRAFT`
            : `SUBMITTED`
        }`,
        autoClose: 3000,
        color: "green",
        icon: <IconCheck />,
        withCloseButton: false,
        // Refresh tabel
      });
    } else {
      // Beritahukan pengguna bahwa terjadi kesalahan dalam proses menyimpan dokumen
      notifications.show({
        title: "Gagal",
        message: `Terjadi kesalahan saat proses penyimpanan proposal dilakukan`,
        autoClose: 3000,
        color: "red",
        icon: <IconX />,
        withCloseButton: false,
        // Refresh tabel
      });
    }
  };

  return (
    <Modal.Root
      opened={konfirmasiPopUp}
      onClose={() => setKonfirmasiPopUp(false)}
      centered
      transitionProps={{ transition: "slide-down", duration: 300 }}
      radius="md"
    >
      <Modal.Overlay blur={1} />
      <Modal.Content>
        <Modal.Header sx={{ backgroundColor: aksenWarna.header }} p={10}>
          <Modal.Title>
            <Title order={4} color="white">
              Konfirmasi
            </Title>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body m={15}>
          {!valid
            ? TidakValid(setKonfirmasiPopUp)
            : RenderKonfirmasi(setKonfirmasiPopUp, proposalToko)}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
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

// fungsi untuk melakukan pengecekan nilai dalam input item
const cekItemDalamArray = (item: any, array: any[]) => {
  // jika item tidak ada dalam array, berikan notifikasi kepada pengguna
  if (!array.includes(item)) {
    notifications.show({
      title: `Input Item Tidak Sama`,
      message: `Item ${item.toString()} yang sebelumnya terdapat pada proposal kini tidak tersedia.`,
      autoClose: false,
      color: "yellow",
      icon: <IconExclamationMark />,
      withCloseButton: true,
    });
    // return false
    return false;
  } else {
    // else return true
    return true;
  }
};

export const setItemSBU = (item: string, array: string[]) => {
  // jika item ada dalam array
  if (cekItemDalamArray(item, array)) {
    // kembalikan nilai item
    return item;
  } else {
    // jika item tidak ada dalam array, kembalikan ""
    return "";
  }
};

export const setItemRentangPopulasi = (
  item: string,
  array: TLabelValueInputItem[]
) => {
  // map value dan label ke dalam array
  const arrayLabel = array.map((item) => item.label);
  const arrayNilai = array.map((item) => item.value as number);
  // jika item ada dalam array
  if (cekItemDalamArray(item, arrayLabel)) {
    // kembalikan nilai pada indeks dimana arrayLabel === item
    return arrayNilai[arrayLabel.indexOf(item)];
  } else {
    // jika item tidak ada dalam array, kembalikan -1
    return -1;
  }
};

export const setItemKelasMall = (item: string, array: string[]) => {
  // Untuk Item Kelas Mall cukup kompleks karena Input Item
  // ini merupakan komponen Rating pada @mantine/core.
  // Komponen Rating memiliki 2 props utama yaitu emptySymbol
  // dan fullSymbol yang merupakan tipe variabel
  // React.ReactNode | ((value: number) => React.ReactNode)
  // sehingga kita tidak dapat mengevaluasi array properti ini
  // dengan nilai kelas_mall pada proposal
  // Namun kita hanya perlu mengembalikan angka 0 jika nilai
  // kelas_mall pada proposal tidak terdapat pada inputItem
  // kelas_mall saat ini dan angka indeks yang dimulai dari
  // 1 hingga array.length jika nilai terdapat pada inputItem
  if (cekItemDalamArray(item, array)) {
    return array.indexOf(item) + 1;
  } else {
    return 0;
  }
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
  statusDisabilitasInput: Partial<IDisabilitasInputKelayakanTokoBaru>,
  setStatusDisabilitasInput: React.Dispatch<
    React.SetStateAction<Partial<IDisabilitasInputKelayakanTokoBaru>>
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
        provinsi_umr: "DKI Jakarta",
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
  console.log(instances);
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
        vat: ugPPN,
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
        vat: mgPPN,
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

// fungsi untuk set initialValue Formulir
export const setInitialValue = (
  popUp: StatePopUp,
  props: StateKelayakanTokoBaru,
  dataInputItem: IDataInputItemKelayakanTokoBaru,
  dataProposal?: DataKelayakanTokoBaru
) => {
  let formulir: Formulir;
  switch (popUp.modeProposal) {
    case EModePopUpKelayakanTokoBaru.PENAMBAHAN:
      formulir = {
        log: [],
        proposal_id: generateProposalID(props),
        versi_proposal: "",
        input: {
          versi_model: "",
          nama_model: "",
          sbu: "",
          kota_kabupaten: "",
          rentang_populasi: -1,
          kelas_mall: 0,
          luas_toko: undefined,
          margin_penjualan: 0.35,
          ppn: 0.11,
          tahun_umr: new Date().getFullYear().toString(),
          provinsi_umr: "DKI Jakarta",
          jumlah_staff: 1,
          biaya_oau: 0.06,
          biaya_sewa: undefined,
          lama_sewa: 1,
          biaya_fitout: undefined,
        },
        output: {
          user_generated: {
            sales: undefined,
            vat: 0,
            net_sales: 0,
            cogs: 0,
            gross_profit: 0,
            staff_expense: 0,
            oau_expense: 0,
            rental_expense: 0,
            fitout_expense: 0,
            store_income: 0,
          },
          model_generated: {
            sales: 0,
            vat: 0,
            net_sales: 0,
            cogs: 0,
            gross_profit: 0,
            staff_expense: 0,
            oau_expense: 0,
            rental_expense: 0,
            fitout_expense: 0,
            store_income: 0,
          },
        },
        remark: "",
      };
      return formulir;
    default:
      const input = dataProposal?.data.input;
      const output = dataProposal?.data.output;
      const user_generated = output?.user_generated;
      const model_generated = output?.model_generated;
      const remark = dataProposal?.data.remark;
      formulir = {
        proposal_id: dataProposal?.proposal_id!,
        versi_proposal: dataProposal?.versi.toString()!,
        input: {
          versi_model: input?.versi_model,
          nama_model: input?.nama_model,
          sbu: setItemSBU(input?.sbu!, dataInputItem.sbuItem),
          kota_kabupaten: input?.kota_kabupaten,
          rentang_populasi: setItemRentangPopulasi(
            input?.rentang_populasi!,
            dataInputItem.rentangPopulasi
          ),
          kelas_mall: setItemKelasMall(
            input?.kelas_mall!,
            props.inputItem.kelasMallItem.map((item) => {
              return item.label;
            })
          ),
          luas_toko: input?.luas_toko,
          margin_penjualan: input?.margin_penjualan,
          ppn: input?.ppn,
          tahun_umr: input?.tahun_umr.toString(),
          provinsi_umr: input?.provinsi_umr,
          jumlah_staff: input?.jumlah_staff,
          biaya_oau: input?.biaya_atk_utilitas,
          biaya_sewa: input?.biaya_sewa,
          lama_sewa: input?.lama_sewa,
          biaya_fitout: input?.biaya_fitout,
        },
        output: {
          user_generated: {
            sales: input?.prediksi_user,
            vat: user_generated?.vat!,
            net_sales: user_generated?.net_sales!,
            cogs: user_generated?.cogs!,
            gross_profit: user_generated?.gross_profit!,
            staff_expense: user_generated?.staff_expense!,
            oau_expense: user_generated?.oau_expense!,
            rental_expense: user_generated?.rental_expense!,
            fitout_expense: user_generated?.fitout_expense!,
            store_income: user_generated?.store_income!,
          },
          model_generated: {
            sales: input?.prediksi_model,
            vat: model_generated?.vat!,
            net_sales: model_generated?.net_sales!,
            cogs: model_generated?.cogs!,
            gross_profit: model_generated?.gross_profit!,
            staff_expense: model_generated?.staff_expense!,
            oau_expense: model_generated?.oau_expense!,
            rental_expense: model_generated?.rental_expense!,
            fitout_expense: model_generated?.fitout_expense!,
            store_income: model_generated?.store_income!,
          },
        },
        remark: remark?.konten!,
        log: dataProposal?.data.log_output!,
      };
      return formulir;
  }
};

// fungsi toggle disabilitas input
export const setDisabilitasInputAwal = (popUp: StatePopUp) => {
  let statusAwalDisabilitasInput: Partial<IDisabilitasInputKelayakanTokoBaru> =
    {
      versi_proposal: false,
      sbu: false,
      kota_kabupaten: false,
      rentang_populasi: false,
      kelas_mall: false,
      luas_toko: false,
      prediksi_penjualan_user: false,
      margin_penjualan: false,
      ppn: false,
      tahun_umr: false,
      provinsi_umr: false,
      jumlah_staff: false,
      biaya_oau: false,
      biaya_sewa: false,
      lama_sewa: false,
      biaya_fitout: false,
    };
  switch (popUp.modeProposal) {
    case EModePopUpKelayakanTokoBaru.PENAMBAHAN:
    case EModePopUpKelayakanTokoBaru.SUNTING:
      statusAwalDisabilitasInput = {
        rentang_populasi: true,
        tahun_umr: true,
        provinsi_umr: true,
      };
      break;
    default:
      break;
  }
  return statusAwalDisabilitasInput;
};
