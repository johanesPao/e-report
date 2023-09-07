import { invoke } from "@tauri-apps/api/tauri";
import {
  DataKelayakanTokoBaru,
  TDataTabelKelayakanTokoBaru,
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
  IApprovalTokoBaru,
  ResponJSONSemuaProposalTokoBaru,
  ResponJSONSemuaApprovalTokoBaru,
  IKredensialApproverTokoBaru,
  ResponJSONKredensialApproverTokoBaru,
  IApproverKredensialTokoBaruStatus,
  ResponJSON,
  ResponJSONApprovalProposalID,
  EStatusApprovalTokoBaru,
} from "../basic";
import {
  Button,
  Grid,
  Group,
  Modal,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import emailjs from "@emailjs/browser";
import { setDataKelayakanTokoBaru } from "../../fitur_state/dataBank";
import { UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconExclamationMark, IconX } from "@tabler/icons-react";
import { StatePopUp } from "../../komponen/PopUp";

export interface StateKelayakanTokoBaru {
  tampilanTabel: TDataTabelKelayakanTokoBaru[];
  dataKelayakanTokoBaru: DataKelayakanTokoBaru[];
  muatTabelKelayakanTokoBaru: boolean;
  inputItem: IInputItemKelayakanTokoBaru;
  approver: IKredensialApproverTokoBaru[];
  konfigurasiEmail: IKonfigEmailTokoBaru;
  objekIdPengguna: string;
}

interface IKonfigEmailTokoBaru {
  serviceId: string;
  templateId: string;
  apiKey: string;
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
  nilaiAwal: DataKelayakanTokoBaru,
  dataProposal: DataKelayakanTokoBaru[],
  stateTombolDua: boolean,
  aksenWarna: IAksenWarnaPopUp,
  props: StateKelayakanTokoBaru,
  tindakanProposal: ETindakanProposalTokoBaru,
  pengguna: string,
  popUp: StatePopUp,
  setPopUp: React.Dispatch<React.SetStateAction<StatePopUp>>
) => {
  const theme = useMantineTheme();
  // Jika terdapat kesalahan, ubah aksenWarna
  if (!valid) {
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
      case ETindakanProposalTokoBaru.DITERIMA:
        status = EStatusProposalTokoBaru.DITERIMA;
        break;
      case ETindakanProposalTokoBaru.DITOLAK:
        status = EStatusProposalTokoBaru.DITOLAK;
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
      // versi_proposal tidak dirubah di interface ini, tapi di fungsi simpanProposal
      // atau updateProposal
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
            : new Date(
                //@ts-ignore
                parseInt(dataProposal[0].data.dibuat.$date.$numberLong)
              ).toISOString(),
        diedit: new Date().toISOString(),
        pengguna: pengguna,
        status,
      },
    };
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
    proposal: IProposalToko,
    modeProposal: EModePopUpKelayakanTokoBaru,
    tindakanProposal: ETindakanProposalTokoBaru
  ) => {
    // inisiasi approver email
    const listApprover = props.approver;
    interface PopUpInfoFungsi {
      info: JSX.Element;
      prosesProposal: (
        tambahVersi?: boolean,
        approval?: boolean
      ) => Promise<void>;
      tambahVersi?: boolean;
      approval?: boolean;
    }
    // fungsi komponen
    const komponenTeksInfo = (
      teks: string,
      peringatan?: string,
      warnaPeringatan?: string
    ) => {
      return (
        <div>
          <Text>{teks}</Text>
          <Grid grow my="md" gutter={0}>
            <Grid.Col span={7}>
              <Text>Proposal ID</Text>
            </Grid.Col>
            <Grid.Col span={5}>
              <Text>{`: ${proposal.proposal_id}`}</Text>
            </Grid.Col>
            <Grid.Col span={7}>
              <Text>Strategic Business Unit</Text>
            </Grid.Col>
            <Grid.Col span={5}>
              <Text>{`: ${proposal.data.input.sbu}`}</Text>
            </Grid.Col>
            <Grid.Col span={7}>
              <Text>Kota/Kabupaten</Text>
            </Grid.Col>
            <Grid.Col span={5}>
              <Text>{`: ${proposal.data.input.kota_kabupaten}`}</Text>
            </Grid.Col>
            <Grid.Col span={7}>
              <Text>Kelas Mall</Text>
            </Grid.Col>
            <Grid.Col span={5}>
              <Text>{`: ${proposal.data.input.kelas_mall}`}</Text>
            </Grid.Col>
            <Grid.Col span={7}>
              <Text>Luas Toko</Text>
            </Grid.Col>
            <Grid.Col span={5}>
              <Text>{`: ${proposal.data.input.luas_toko} m2`}</Text>
            </Grid.Col>
            <Grid.Col span={7}>
              <Text>Store Income (User)</Text>
            </Grid.Col>
            <Grid.Col span={5}>
              <Text>{`: Rp ${proposal.data.output.user_generated.store_income.toLocaleString(
                "id-ID",
                { maximumFractionDigits: 0 }
              )}`}</Text>
            </Grid.Col>
            <Grid.Col span={7}>
              <Text>Store Income (Model)</Text>
            </Grid.Col>
            <Grid.Col span={5}>
              <Text>{`: Rp ${proposal.data.output.model_generated.store_income.toLocaleString(
                "id-ID",
                { maximumFractionDigits: 0 }
              )}`}</Text>
            </Grid.Col>
          </Grid>
          {peringatan && (
            <Text
              italic
              c={
                warnaPeringatan ? warnaPeringatan : aksenWarna.tombolBatal.utama
              }
              align="center"
              styles={{}}
            >
              {peringatan}
            </Text>
          )}
        </div>
      );
    };

    let infoFungsi: PopUpInfoFungsi = {} as PopUpInfoFungsi;
    switch (modeProposal) {
      case EModePopUpKelayakanTokoBaru.PENAMBAHAN:
        switch (tindakanProposal) {
          case ETindakanProposalTokoBaru.SIMPAN:
            infoFungsi = {
              info: komponenTeksInfo(
                `Anda akan menyimpan proposal baru dengan proposal ID ${proposal.proposal_id} sebagai DRAFT dengan ringkasan sebagai berikut:`
              ),
              prosesProposal: (tambahVersi?: boolean, approval?: boolean) =>
                simpanProposal(proposal, props, tambahVersi, approval),
            };
            break;
          case ETindakanProposalTokoBaru.KIRIM:
            infoFungsi = {
              info: komponenTeksInfo(
                `Anda akan mengirimkan proposal dengan proposal ID ${proposal.proposal_id} untuk proses PERSETUJUAN dengan ringkasan sebagai berikut:`,
                `Kami akan mengirimkan notifikasi melalui email kepada pengguna yang memiliki otorisasi persetujuan untuk melakukan review atas proposal toko baru ini. ${
                  listApprover.length > 0 &&
                  `(` +
                    listApprover
                      .map((approver) => `${approver.nama} <${approver.email}>`)
                      .join(`, `) +
                    `)`
                }`,
                aksenWarna.tombolKirim.utama
              ),
              prosesProposal: (tambahVersi?: boolean, approval?: boolean) =>
                simpanProposal(proposal, props, tambahVersi, approval),
              approval: true,
            };

            break;
          default:
            return null;
        }
        break;
      case EModePopUpKelayakanTokoBaru.SUNTING:
        switch (tindakanProposal) {
          case ETindakanProposalTokoBaru.SIMPAN:
            infoFungsi = {
              info: komponenTeksInfo(
                `Anda akan melakukan perubahan pada proposal dengan ID ${
                  proposal.proposal_id
                } dan menciptakan versi ${proposal.versi + 1}
                  yang akan kembali disimpan sebagai DRAFT dengan ringkasan sebagai berikut:`,
                `Store Income (User) Rp ${nilaiAwal.data.output.user_generated.store_income.toLocaleString(
                  "id-ID",
                  { maximumFractionDigits: 0 }
                )} > Rp ${proposal.data.output.user_generated.store_income.toLocaleString(
                  "id-ID",
                  { maximumFractionDigits: 0 }
                )} dan Store Income (Model) Rp ${nilaiAwal.data.output.model_generated.store_income.toLocaleString(
                  "id-ID",
                  { maximumFractionDigits: 0 }
                )} > Rp ${proposal.data.output.model_generated.store_income.toLocaleString(
                  "id-ID",
                  { maximumFractionDigits: 0 }
                )}`,
                aksenWarna.mayor
              ),
              prosesProposal: (tambahVersi?: boolean, approval?: boolean) =>
                simpanProposal(proposal, props, tambahVersi, approval),
              tambahVersi: true,
            };
            break;
          case ETindakanProposalTokoBaru.KIRIM:
            let teks: string = "";
            if (stateTombolDua) {
              teks = `Tidak ada perubahan pada proposal dengan ID ${proposal.proposal_id} versi ${proposal.versi}, maka kami akan merubah status proposal dari DRAFT menjadi SUBMITTED untuk menunggu review dan PERSETUJUAN dari pihak terkait. Berikut adalah ringkasan proposal yang diajukan:`;
            } else {
              teks = `Anda akan melakukan perubahan pada proposal dengan ID ${
                proposal.proposal_id
              } dan menciptakan versi ${
                proposal.versi + 1
              } untuk selanjutnya dikirimkan untuk proses PERSETUJUAN dengan pihak terkait. Berikut adalah ringkasan proposal yang diajukan:`;
            }
            infoFungsi = {
              info: komponenTeksInfo(
                teks,
                `Kami akan mengirimkan notifikasi melalui email kepada pengguna yang memiliki otorisasi persetujuan untuk melakukan review ${
                  listApprover.length > 0 &&
                  `(` +
                    listApprover
                      .map((approver) => `${approver.nama} <${approver.email}>`)
                      .join(`, `) +
                    `)`
                } atas proposal toko baru ini.${
                  stateTombolDua
                    ? ``
                    : ` Store Income (User) Rp ${nilaiAwal.data.output.user_generated.store_income.toLocaleString(
                        "id-ID",
                        { maximumFractionDigits: 0 }
                      )} > Rp ${proposal.data.output.user_generated.store_income.toLocaleString(
                        "id-ID",
                        { maximumFractionDigits: 0 }
                      )} dan Store Income (Model) Rp ${nilaiAwal.data.output.model_generated.store_income.toLocaleString(
                        "id-ID",
                        { maximumFractionDigits: 0 }
                      )} > Rp ${proposal.data.output.model_generated.store_income.toLocaleString(
                        "id-ID",
                        { maximumFractionDigits: 0 }
                      )}`
                }`,
                aksenWarna.tombolKirim.utama
              ),
              prosesProposal: (tambahVersi?: boolean, approval?: boolean) =>
                stateTombolDua
                  ? updateStatusProposal(
                      proposal,
                      EStatusProposalTokoBaru.SUBMIT,
                      approval
                    )
                  : simpanProposal(proposal, props, tambahVersi, approval),
              approval: true,
              tambahVersi: !stateTombolDua,
            };
            break;
          default:
            return null;
        }
        break;
      // CONTINUE HERE, COME UP WITH A WAY TO
      // simpanProposal or updateStatusProposal for SUNTING and
      // PERSETUJUAN skenario
      case EModePopUpKelayakanTokoBaru.PERSETUJUAN:
        switch (tindakanProposal) {
          case ETindakanProposalTokoBaru.DITERIMA:
            infoFungsi = {
              info: komponenTeksInfo(
                `Anda akan MENERIMA proposal dengan Proposal ID ${proposal.proposal_id} dengan ringkasan sebagai berikut:`
              ),
              prosesProposal: () =>
                updateStatusApproval(
                  proposal,
                  ETindakanProposalTokoBaru.DITERIMA
                ),
            };
            break;
          case ETindakanProposalTokoBaru.DITOLAK:
            infoFungsi = {
              info: komponenTeksInfo(
                `Anda akan MENOLAK proposal dengan Proposal ID ${proposal.proposal_id} dengan ringkasan sebagai berikut:`,
                `Melakukan penolakan terhadap proposal akan menutup approval dari proposal dan proposal dengan ID ${proposal.proposal_id} akan langsung berubah statusnya menjadi REJECTED. Anda yakin untuk melanjutkan penolakan ini?`,
                theme.colors.red[9]
              ),
              prosesProposal: () =>
                updateStatusApproval(
                  proposal,
                  ETindakanProposalTokoBaru.DITOLAK
                ),
            };
            break;
          default:
            return null;
        }
        break;
      default:
        return null;
    }
    // fungsi ini perlu untuk mengetahui modeProposal dan tindakanPopUp
    return (
      <>
        <Group>{infoFungsi.info}</Group>
        <Group grow mt="md">
          <Button
            variant="outline"
            onClick={() =>
              infoFungsi.prosesProposal(
                infoFungsi.tambahVersi,
                infoFungsi.approval
              )
            }
            styles={{
              root: {
                color: aksenWarna.tombolKirim.utama,
                borderColor: aksenWarna.tombolKirim.utama,
                ...theme.fn.hover({
                  backgroundColor: aksenWarna.tombolKirim.hover.background,
                  color: aksenWarna.tombolKirim.hover.teks,
                }),
              },
              label: {
                fontSize: "20px",
              },
            }}
          >
            Lanjutkan
          </Button>
          <Button
            variant="outline"
            onClick={() => setKonfirmasiPopUp(false)}
            styles={{
              root: {
                color: aksenWarna.tombolBatal.utama,
                borderColor: aksenWarna.tombolBatal.utama,
                ...theme.fn.hover({
                  backgroundColor: aksenWarna.tombolBatal.hover.background,
                  color: aksenWarna.tombolBatal.hover.teks,
                }),
              },
              label: {
                fontSize: "20px",
              },
            }}
          >
            Batal
          </Button>
        </Group>
      </>
    );
  };

  // Tulis dokumen ke database mongo
  const simpanProposal = async (
    proposal: IProposalToko,
    props: StateKelayakanTokoBaru,
    tambahVersi?: boolean,
    approval?: boolean
  ) => {
    let proposalToko = proposal;
    if (tambahVersi) {
      proposalToko = {
        ...proposalToko,
        versi: proposalToko.versi + 1,
      };
    }
    const respon: string = await invoke("simpan_proposal_toko_baru", {
      proposal: proposalToko,
    });
    const hasil = JSON.parse(respon);
    if (hasil.status) {
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
      // jika approval
      if (approval) {
        buatApproval(props, proposal.proposal_id);
      }
      // Tutup popup konfirmasi
      setKonfirmasiPopUp(false);
      // Tutup formulir
      setPopUp((stateSebelumnya) => ({
        ...stateSebelumnya,
        togglePopUp: false,
      }));
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

  // Buat approval baru
  const buatApproval = async (
    props: StateKelayakanTokoBaru,
    proposalID: string
  ) => {
    const listApprover = props.approver.map((approver) => approver.id.$oid);
    const respon: string = await invoke("buat_approval_baru", {
      proposalId: proposalID,
      vektorApprover: listApprover,
    });
    const hasil = JSON.parse(respon);

    if (hasil.status) {
      notifications.show({
        title: "Sukses",
        message: `Approval untuk proposal toko dengan Proposal ID ${proposalID} berhasil dibuat`,
        autoClose: 3000,
        color: "green",
        icon: <IconCheck />,
        withCloseButton: false,
      });
      await kirimEmailRekuesApproval(
        props.konfigurasiEmail,
        proposalToko,
        proposalToko.data.input.nama_model,
        listApprover
      );
    }
  };

  // Kirim email approval
  const kirimEmailRekuesApproval = async (
    konfigurasiEmail: IKonfigEmailTokoBaru,
    proposal: IProposalToko,
    namaModel: string,
    approver: string[]
  ) => {
    // nama dan email approver
    const respon: string = await invoke("ambil_nama_email_approval_toko_baru", {
      vektorIdString: approver,
    });
    const hasil: ResponJSONKredensialApproverTokoBaru = JSON.parse(respon);

    if (hasil.status) {
      const arrayEmail = hasil.konten.map((approver) => approver.email);
      // data email
      const data = {
        pengirim: proposal.data.pengguna,
        tujuan: arrayEmail.join(", "),
        nama_model: namaModel,
        sbu: proposal.data.input.sbu,
        kota_kabupaten: proposal.data.input.kota_kabupaten,
        user_store_income: `Rp ${proposal.data.output.user_generated.store_income.toLocaleString(
          "id-ID",
          { maximumFractionDigits: 0 }
        )}`,
        model_store_income: `Rp ${proposal.data.output.model_generated.store_income.toLocaleString(
          "id-ID",
          { maximumFractionDigits: 0 }
        )}`,
        luas_toko: `${proposal.data.input.luas_toko.toLocaleString("id-ID", {
          maximumFractionDigits: 2,
        })} m2`,
        biaya_sewa: `Rp ${proposal.data.input.biaya_sewa.toLocaleString(
          "id-ID",
          {
            maximumFractionDigits: 0,
          }
        )}`,
        lama_sewa: `${proposal.data.input.lama_sewa}`,
        biaya_fitout: `Rp ${proposal.data.input.biaya_fitout.toLocaleString(
          "id-ID",
          { maximumFractionDigits: 0 }
        )}`,
        proposal_id: proposal.proposal_id,
      };
      // kirim email
      emailjs
        .send(
          konfigurasiEmail.serviceId,
          konfigurasiEmail.templateId,
          data,
          konfigurasiEmail.apiKey
        )
        .then(
          (_respon) => {
            notifications.show({
              title: "Email Approval Berhasil",
              message: `Approval untuk Proposal Toko Baru berhasil dibuat dan email notifikasi sudah dikirimkan kepada approver`,
              autoClose: 3000,
              color: "teal",
              icon: <IconCheck />,
              withCloseButton: false,
            });
          },
          (error) => {
            notifications.show({
              title: "Email Approval Gagal",
              message: `Approval untuk Proposal Toko Baru gagal dikirimkan kepada approver. (${error})`,
              autoClose: 3000,
              color: "red",
              icon: <IconX />,
              withCloseButton: false,
            });
          }
        );
    }
  };

  // Update status proposal pada database mongo
  const updateStatusProposal = async (
    proposal: IProposalToko,
    status: EStatusProposalTokoBaru,
    approval?: boolean
  ) => {
    const respon: ResponJSON = await invoke(
      "update_status_proposal_toko_baru",
      {
        proposalId: proposal.proposal_id,
        versi: proposal.versi,
        status,
      }
    );

    if (respon.status) {
      // Beritahukan pengguna bahwa status dokumen berhasil diupdate
      notifications.show({
        title: "Sukses",
        message: `Proposal toko dengan Proposal ID ${
          proposal.proposal_id
        } versi ${proposal.versi} berhasil dirubah statusnya menjadi 
        ${
          tindakanProposal === ETindakanProposalTokoBaru.KIRIM
            ? `SUBMITTED`
            : tindakanProposal === ETindakanProposalTokoBaru.DITERIMA
            ? `DITERIMA`
            : `DITOLAK`
        }`,
        autoClose: 3000,
        color: "green",
        icon: <IconCheck />,
        withCloseButton: false,
        // Refresh tabel
      });
      if (approval) {
        buatApproval(props, proposal.proposal_id);
      }
      // Tutup popup konfirmasi
      setKonfirmasiPopUp(false);
      // Tutup formulir
      setPopUp((stateSebelumnya) => ({
        ...stateSebelumnya,
        togglePopUp: false,
      }));
    } else {
      notifications.show({
        title: "Gagal",
        message: `Terjadi kesalahan saat melakukan proses update proposal`,
        autoClose: 3000,
        color: "red",
        icon: <IconX />,
        withCloseButton: false,
        // Refresh tabel
      });
    }
  };

  // Update status approval pada database mongo
  const updateStatusApproval = async (
    proposal: IProposalToko,
    tindakanApproval:
      | ETindakanProposalTokoBaru.DITERIMA
      | ETindakanProposalTokoBaru.DITOLAK
  ) => {
    // get proposal approval status
    const responApproval: ResponJSONApprovalProposalID = await invoke(
      "ambil_approval_proposal_toko_baru",
      {
        proposalId: proposal.proposal_id,
      }
    );
    // jika approval.status
    if (responApproval.status) {
      // jika ada data yang dikembalikan
      if (
        responApproval.approval_count !== undefined &&
        responApproval.approval_count > 0
      ) {
        // placeholder jumlahSetuju
        let jumlahSetuju: number =
          tindakanProposal === ETindakanProposalTokoBaru.DITERIMA
            ? responApproval.konten!.approval.filter(
                (approval) =>
                  approval.status === EStatusApprovalTokoBaru.DITERIMA
              ).length
            : 0;
        // update status approval proposal pada koleksi approval
        const responPersetujuan: ResponJSON = await invoke(
          "update_status_approval_proposal_toko_baru",
          {
            proposalId: proposal.proposal_id,
            idApprover: props.objekIdPengguna,
            status:
              tindakanApproval === ETindakanProposalTokoBaru.DITOLAK
                ? EStatusApprovalTokoBaru.DITOLAK
                : EStatusApprovalTokoBaru.DITERIMA,
          }
        );
        // jika perubahan status approval proposal berhasil
        if (responPersetujuan.status) {
          // berikan pengguna notifikasi bahwa status approval telah berhasil diupdate
          notifications.show({
            title: "Update Status Approval Sukses",
            message: `Update status approval dari proposal dengan ID ${proposal.proposal_id} berhasil dilakukan`,
            autoClose: 3000,
            color: "teal",
            icon: <IconCheck />,
            withCloseButton: false,
          });
          // switch case tindakanProposal untuk penanganan yang berbeda
          switch (tindakanProposal) {
            case ETindakanProposalTokoBaru.DITERIMA:
              // jika jumlahSetuju == responApproval.konten!.approval.length - 1
              // maka pengguna adalah approver terakhir dan kita perlu untuk merubah
              // status proposal pada koleksi proposal menjadi
              // EStatusProposalTokoBaru.DITERIMA
              if (jumlahSetuju === responApproval.konten!.approval.length - 1) {
                updateStatusProposal(
                  proposal,
                  EStatusProposalTokoBaru.DITERIMA
                );
              } else {
                // Tutup popup konfirmasi
                setKonfirmasiPopUp(false);
                // Tutup formulir
                setPopUp((stateSebelumnya) => ({
                  ...stateSebelumnya,
                  togglePopUp: false,
                }));
              }
              break;
            case ETindakanProposalTokoBaru.DITOLAK:
              // update status proposal pada koleksi proposal menjadi
              // EStatusProposalTokoBaru.DITOLAK
              updateStatusProposal(proposal, EStatusProposalTokoBaru.DITOLAK);
              // tidak perlu menutup konfirmasiPopUp dan popUp karena
              // sudah ditangani oleh updateStatusProposal
              break;
            default:
              return;
          }
        } else {
          // berikan pengguna notifikasi bahwa update status proposal
          // tidak berhasil dilakukan
          notifications.show({
            title: "Update Status Approval Gagal",
            message: `Update status approval dari proposal dengan ID ${proposal.proposal_id} tidak berhasil dilakukan`,
            autoClose: 3000,
            color: "red",
            icon: <IconX />,
            withCloseButton: false,
          });
        }
      } else {
        // berikan pengguna notifikasi bahwa proposal tersebut tidak
        // memiliki approval
        notifications.show({
          title: "Approval Tidak Ditemukan",
          message: `Approval untuk Proposal ${proposal.proposal_id} tidak dapat ditemukan, pastikan status proposal adalah SUBMITTED`,
          autoClose: 3000,
          color: "yellow",
          icon: <IconExclamationMark />,
          withCloseButton: false,
        });
      }
    } else {
      // jika responApproval.status false (error)
      // berikan pengguna notifikasi bahwa terjadi kesalahan
      // dalam proses penarikan data approval proposal
      notifications.show({
        title: "Terjadi Kesalahan",
        message: `Tidak berhasil melakukan penarikan data approval untuk proposal ${proposal.proposal_id}, periksa kembali jaringan anda atau coba beberapa saat lagi.`,
        autoClose: 3000,
        color: "yellow",
        icon: <IconExclamationMark />,
        withCloseButton: false,
      });
    }
  };

  let judulKonfirmasi: string = "";
  switch (popUp.modeProposal) {
    case EModePopUpKelayakanTokoBaru.PENAMBAHAN:
      switch (tindakanProposal) {
        case ETindakanProposalTokoBaru.SIMPAN:
          judulKonfirmasi = `DRAFT Proposal ID ${proposalToko.proposal_id}`;
          break;
        case ETindakanProposalTokoBaru.KIRIM:
          judulKonfirmasi = `PERSETUJUAN Proposal ID ${proposalToko.proposal_id}`;
          break;
        default:
          return null;
      }
      break;
    case EModePopUpKelayakanTokoBaru.SUNTING:
      switch (tindakanProposal) {
        case ETindakanProposalTokoBaru.SIMPAN:
          judulKonfirmasi = `DRAFT Proposal ID ${proposalToko.proposal_id} Versi ${proposalToko.versi}`;
          break;
        case ETindakanProposalTokoBaru.KIRIM:
          judulKonfirmasi = `PERSETUJUAN Proposal ID ${proposalToko.proposal_id}`;
          break;
        default:
          return null;
      }
      break;
    case EModePopUpKelayakanTokoBaru.PERSETUJUAN:
      switch (tindakanProposal) {
        case ETindakanProposalTokoBaru.DITERIMA:
          judulKonfirmasi = `PERSETUJUAN Proposal ID ${proposalToko.proposal_id}`;
          break;
        case ETindakanProposalTokoBaru.DITOLAK:
          judulKonfirmasi = `PENOLAKAN Proposal ID ${proposalToko.proposal_id}`;
          break;
        default:
          return null;
      }
      break;
    default:
      return null;
  }

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
              {`${judulKonfirmasi}`}
            </Title>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body m={15}>
          {!valid
            ? TidakValid(setKonfirmasiPopUp)
            : RenderKonfirmasi(
                setKonfirmasiPopUp,
                proposalToko,
                popUp.modeProposal!,
                tindakanProposal
              )}
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

export const ambilProposalDanApproval = async (
  dispatch: any,
  arrayObjekIdApprover: string[],
  setProps: React.Dispatch<React.SetStateAction<StateKelayakanTokoBaru>>
) => {
  // set state loading tabel
  setProps((stateSebelumnya) => ({
    ...stateSebelumnya,
    muatTabelKelayakanTokoBaru: true,
  }));
  // fungsi async untuk mengambil semua proposal dari koleksi proposal
  const allProposal = async () => {
    const respon: string = await invoke("ambil_semua_proposal_toko_baru");
    return await JSON.parse(respon);
  };
  // fungsi async untuk mengambil semua approval status dari tabel approval
  const allApproval = async () => {
    const respon: string = await invoke(
      "ambil_semua_status_approval_toko_baru"
    );
    return await JSON.parse(respon);
  };
  // fungsi async untuk mengekstrak nama email dari arrayObjekIdApprover
  const arrayKredensialApprover = async () => {
    const respon: string = await invoke("ambil_nama_email_approval_toko_baru", {
      vektorIdString: arrayObjekIdApprover,
    });
    return await JSON.parse(respon);
  };
  // fungsi async untuk mendapatkan IKredensialApproverTokoBaru untuk mapping
  // dengan ObjekID pada approval.konten[0].approval.id.$oid
  const getApproverKredensial = async (
    approval: ResponJSONSemuaApprovalTokoBaru
  ) => {
    // Jika approval.konten length lebih dari 0 jalankan fungsi ini
    if (approval.status && approval.konten.length > 0) {
      // inisiasi array untuk menampung ObjekId
      let arrayObjekId: string[] = [];
      // lakukan looping per approval
      for (var proposalApproval of approval.konten) {
        // looping approval dalam proposalApproval dan simpan ObjekId
        // dalam arrayObjectId
        for (var approver of proposalApproval.approval) {
          arrayObjekId.push(approver.id.$oid);
        }
      }
      // ekstrak unik ObjekId dari arrayObjekId
      const unikArrayObjekId = [...new Set<string>(arrayObjekId)];
      // kueri kredensial approver
      const respon: string = await invoke(
        "ambil_nama_email_approval_toko_baru",
        {
          vektorIdString: unikArrayObjekId,
        }
      );
      const hasil: ResponJSONKredensialApproverTokoBaru = JSON.parse(respon);
      // jika hasil.status dan hasil.konten.length lebih dari 0
      if (hasil.status && hasil.konten.length > 0) {
        // kembalikan array IKredensialApproverTokoBaru
        return hasil.konten;
      } else {
        return [] as IKredensialApproverTokoBaru[];
      }
    } else {
      return [] as IKredensialApproverTokoBaru[];
    }
  };

  const [proposal, approval, approver]: [
    proposal: ResponJSONSemuaProposalTokoBaru,
    approval: ResponJSONSemuaApprovalTokoBaru,
    approver: ResponJSONKredensialApproverTokoBaru
  ] = await Promise.all([
    allProposal(),
    allApproval(),
    arrayKredensialApprover(),
  ]);

  if (approver.status) {
    setProps((stateSebelumnya) => ({
      ...stateSebelumnya,
      approver: approver.konten,
    }));
  }

  if (proposal.status && approval.status) {
    // ekstrak array kredensial approver
    const kredensialApprover = await getApproverKredensial(approval);
    // simpan data full proposal
    dispatch(setDataKelayakanTokoBaru(proposal.konten));
    // unik proposal
    const unikProposal = [
      ...new Set<string>(
        proposal.konten.map((proposal: any) => proposal.proposal_id)
      ),
    ];

    // ekstrak dan transform data untuk tampilan tabel
    let proposalTabelData: TDataTabelKelayakanTokoBaru[] = [];
    // looping semua proposalID dalam unikPropoasl
    for (var proposalID of unikProposal) {
      const proposalTampilan = proposal.konten.filter(
        (item: any) =>
          item.proposal_id === proposalID &&
          item.versi ===
            Math.max(
              ...proposal.konten
                .filter((proposal: any) => proposal.proposal_id === proposalID)
                .map((proposal: any) => proposal.versi)
            )
      );
      // cek jika proposalID memiliki approval
      const adaStatusApproval: boolean = approval.konten
        .map((approval: IApprovalTokoBaru) => approval.proposal_id)
        .includes(proposalID);
      // generate interface data proposal untuk tampilan tabel
      const proposalData: TDataTabelKelayakanTokoBaru = {
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
          //@ts-ignore
          parseInt(proposalTampilan[0].data.dibuat.$date.$numberLong)
        ),
        diedit: new Date(
          //@ts-ignore
          parseInt(proposalTampilan[0].data.diedit.$date.$numberLong)
        ),
        status: proposalTampilan[0].data.status,
        approval_status: adaStatusApproval
          ? approval.konten
              // filter item approval berdasar proposal id yang sama
              .filter((approval) => approval.proposal_id === proposalID)[0]
              // map item approval untuk mendapatkan IApproverKredensialTokoBaruStatus
              // dimana approver ObjekId sama dengan kredensialApprover ObjekID
              // ambil id, nama, email dan status
              .approval.map((approver) => {
                const approverKredensial = kredensialApprover.filter(
                  (kredensial) => kredensial.id.$oid === approver.id.$oid
                )[0];
                const approverKredensialDanStatus: IApproverKredensialTokoBaruStatus =
                  {
                    id: approver.id,
                    nama: approverKredensial.nama,
                    email: approverKredensial.email,
                    status: approver.status,
                  };
                return approverKredensialDanStatus;
              })
          : ([] as IApproverKredensialTokoBaruStatus[]),
      };
      // tambahkan data proposal ke dalam array proposal yang akan ditampilkan
      // dalam tabel
      proposalTabelData.push(proposalData);
    }
    // set prop tampilanTabel
    setProps((stateSebelumnya) => ({
      ...stateSebelumnya,
      tampilanTabel: proposalTabelData,
    }));
  }
  // set prop memuat tabel menjadi false
  setProps((stateSebelumnya) => ({
    ...stateSebelumnya,
    muatTabelKelayakanTokoBaru: false,
  }));
};

// fungsi untuk melakukan pengecekan nilai dalam input item
const cekItemDalamArray = (popUp: boolean, item: any, array: any[]) => {
  // jika item tidak ada dalam array, berikan notifikasi kepada pengguna
  // HACK: InputPopUpKelayakanTokoBaru akan melakukan beberapa kali
  // rerendering pada awal popup terbuka dan saat popup tertutup. Untuk
  // mencegah notifikasi muncul pada saat popUp ditutup, kita akan
  // mengevaluasi state boolean dari togglePopUp
  if (popUp) {
    if (!array.includes(item)) {
      // return false
      return false;
    } else {
      // else return true
      return true;
    }
  }
};

export const setItemSBU = (popUp: boolean, item: string, array: string[]) => {
  // jika item ada dalam array
  if (cekItemDalamArray(popUp, item, array)) {
    // kembalikan nilai item
    return item;
  } else {
    // jika item tidak ada dalam array, kembalikan ""
    return "";
  }
};

export const setItemRentangPopulasi = (
  popUp: boolean,
  item: string,
  array: TLabelValueInputItem[]
) => {
  // map value dan label ke dalam array
  const arrayLabel = array.map((item) => item.label);
  const arrayNilai = array.map((item) => item.value as number);
  // jika item ada dalam array
  if (cekItemDalamArray(popUp, item, arrayLabel)) {
    // kembalikan nilai pada indeks dimana arrayLabel === item
    return arrayNilai[arrayLabel.indexOf(item)];
  } else {
    // jika item tidak ada dalam array, kembalikan -1
    return -1;
  }
};

export const setItemKelasMall = (
  popUp: boolean,
  item: string,
  array: string[]
) => {
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
  if (cekItemDalamArray(popUp, item, array)) {
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
      // TIDAK DIPERLUKAN KARENA FUNGSI DIBAWAH INI
      // BERADA DALAM useEffect
      // monitorInputPrediksiModel(formulir, props);
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
  props: StateKelayakanTokoBaru,
  modeProposal: EModePopUpKelayakanTokoBaru,
  initialValue: Formulir
) => {
  // cek jika salah satu input prediksi pada formulir dirty
  if (
    formulir.isDirty("input.sbu") ||
    formulir.isDirty("input.rentang_populasi") ||
    formulir.isDirty("input.kota_kabupaten") ||
    formulir.isDirty("input.kelas_mall") ||
    formulir.isDirty("input.luas_toko")
  ) {
    // cek jika salah satu nilai dari input adalah kosong
    if (
      formulir.values.input.sbu === "" ||
      formulir.values.input.rentang_populasi === -1 ||
      formulir.values.input.kelas_mall === 0 ||
      // jika luas_toko = undefined atau string
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
  } else {
    // Dalam kasus semua input adalah clean, cek apakah modeProposal
    // adalah sunting, jika modeProposal adalah sunting dan
    // formulir sudah tersentuh, maka kembalikan nilai sales
    // sesuai dengan initialValue ketimbang tidak melakukan
    // kalkulasi apapun pada sales
    if (
      modeProposal === EModePopUpKelayakanTokoBaru.SUNTING &&
      formulir.isTouched()
    ) {
      formulir.setFieldValue(
        "output.model_generated.sales",
        initialValue.output.model_generated.sales
      );
    }
  }
};

export const kalkulasiStoreIncome = (
  formulir: UseFormReturnType<Formulir, (values: Formulir) => Formulir>,
  props: StateKelayakanTokoBaru
) => {
  // run this only if formulir is dirty
  if (formulir.isDirty()) {
    // Fungsi Kalkulasi
    // PPN
    const kalkulasiPPN = (sales: number, ppnRate: number) => {
      return sales * ppnRate;
    };
    // COGS
    const kalkulasiCOGS = (netSales: number, marginRate: number) => {
      return netSales * (1 - marginRate);
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
    const kalkulasiRentalExp = (
      jumlahTahun: number,
      biayaSewaTotal: number
    ) => {
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
    const RentalExpense = kalkulasiRentalExp(
      inputLamaSewa,
      inputBiayaSewaTotal
    );
    const FitoutExpense = kalkulasiFitoutExp(inputBiayaFitoutTotal);
    const GlobalExpense = StaffExpense + RentalExpense + FitoutExpense;

    // User Generated Related Sales and Cost
    const ug = formulir.values.output.user_generated;
    const ugSales = ug.sales ? ug.sales : 0;
    const ugPPN = kalkulasiPPN(ugSales, inputPPNRate);
    const ugNetSales = ugSales - ugPPN;
    const ugCOGS = kalkulasiCOGS(ugNetSales, inputMargin);
    const ugGrossProfit = ugNetSales - ugCOGS;
    const ugOAUExpense = kalkulasiOAUExp(inputOAURate, ugGrossProfit);
    const ugStoreIncome = ugGrossProfit - (ugOAUExpense + GlobalExpense);

    // Model Generated Related Sales and Cost
    const mg = formulir.values.output.model_generated;
    const mgSales = mg.sales ? mg.sales : 0;
    const mgPPN = kalkulasiPPN(mgSales, inputPPNRate);
    const mgNetSales = mgSales - mgPPN;
    const mgCOGS = kalkulasiCOGS(mgNetSales, inputMargin);
    const mgGrossProfit = mgNetSales - mgCOGS;
    const mgOAUExpense = kalkulasiOAUExp(inputOAURate, mgGrossProfit);
    const mgStoreIncome = mgGrossProfit - (mgOAUExpense + GlobalExpense);

    formulir.setValues((stateSebelumnya) => ({
      ...stateSebelumnya,
      output: {
        user_generated: {
          ...stateSebelumnya.output?.user_generated,
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
          ...stateSebelumnya.output?.model_generated,
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
  }
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
      {`Rp ${
        nilaiOutput !== undefined
          ? nilaiOutput.toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })
          : 0
      }`}
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
        versi_proposal: "1",
        input: {
          versi_model: props.inputItem.model.versi,
          nama_model: props.inputItem.model.namaModel,
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
          sbu: setItemSBU(
            popUp.togglePopUp,
            input?.sbu!,
            dataInputItem.sbuItem
          ),
          kota_kabupaten: input?.kota_kabupaten,
          rentang_populasi: setItemRentangPopulasi(
            popUp.togglePopUp,
            input?.rentang_populasi!,
            dataInputItem.rentangPopulasi
          ),
          kelas_mall: setItemKelasMall(
            popUp.togglePopUp,
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
      remark: false,
      tombol_satu: false,
      tombol_dua: true,
      tombol_tiga: true,
    };
  switch (popUp.modeProposal) {
    case EModePopUpKelayakanTokoBaru.PENAMBAHAN:
    case EModePopUpKelayakanTokoBaru.SUNTING:
      statusAwalDisabilitasInput = {
        ...statusAwalDisabilitasInput,
        rentang_populasi: true,
        tahun_umr: true,
        provinsi_umr: true,
      };
      break;
    case EModePopUpKelayakanTokoBaru.PERSETUJUAN:
      statusAwalDisabilitasInput = {
        ...statusAwalDisabilitasInput,
        sbu: true,
        kota_kabupaten: true,
        rentang_populasi: true,
        kelas_mall: true,
        luas_toko: true,
        prediksi_penjualan_user: true,
        margin_penjualan: true,
        ppn: true,
        tahun_umr: true,
        provinsi_umr: true,
        jumlah_staff: true,
        biaya_oau: true,
        biaya_sewa: true,
        lama_sewa: true,
        remark: true,
        tombol_satu: false,
        tombol_dua: false,
        tombol_tiga: false,
      };
      break;
    default:
      break;
  }

  return statusAwalDisabilitasInput;
};
