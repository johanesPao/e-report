import { Button, Grid, Group, Text, useMantineTheme } from "@mantine/core";
import { StatePopUp } from "../PopUp";
import { DataKelayakanTokoBaru } from "../../fungsi/basic";
import { invoke } from "@tauri-apps/api/tauri";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export const HapusProposal = ({
  data,
  popUp,
  setPopUp,
}: {
  data: DataKelayakanTokoBaru[];
  popUp: StatePopUp;
  setPopUp: React.Dispatch<React.SetStateAction<StatePopUp>>;
}) => {
  const theme = useMantineTheme();
  // filter data dan kembalikan array versi proposal
  const dataProposal = data.filter((proposal) => {
    return proposal.proposal_id === popUp.proposalID;
  });
  // ambil data untuk versi terakhir
  const dataVersiAkhir = dataProposal.filter((proposal) => {
    return proposal.versi === dataProposal.length;
  })[0];

  // fungsi untuk menghapus proposal
  const hapusProposal = async (proposalID: string) => {
    const respon: string = await invoke("hapus_proposal_toko", {
      proposalId: proposalID,
    });
    const hasil = JSON.parse(respon);
    // jika hasil.status true
    if (hasil.status) {
      // Beritahukan pengguna bahwa dokumen berhasil dihapus
      notifications.show({
        title: "Sukses",
        message: `Proposal toko dengan Proposal ID ${popUp.proposalID} berhasil DIHAPUS`,
        autoClose: 3000,
        color: "green",
        icon: <IconCheck />,
        withCloseButton: false,
        // Refresh tabel
      });
    } else {
      // Beritahukan pengguna bahwa terjadi kesalahan dalam proses menghapus dokumen
      notifications.show({
        title: "Gagal",
        message: `Terjadi kesalahan saat proses penghapusan dokumen proposal dilakukan`,
        autoClose: 3000,
        color: "red",
        icon: <IconX />,
        withCloseButton: false,
      });
    }
    // Tutup popup
    setPopUp((stateSebelumnya) => ({
      ...stateSebelumnya,
      togglePopUp: false,
    }));
  };

  return (
    <>
      <Group>
        <Text c={theme.colors.gray[2]}>
          Anda yakin akan menghapus proposal dengan ID {popUp.proposalID} ?
        </Text>
      </Group>
      <Group>
        <Text c={theme.colors.gray[2]}>
          Detail Proposal {popUp.proposalID}:
        </Text>
      </Group>
      <Group grow>
        <Grid>
          <Grid.Col span={6}>
            <Text>Kota / Kabupaten</Text>
            <Text>SBU</Text>
            <Text>Kelas Mall</Text>
            <Text>Luas Toko</Text>
            <Text>Store Income (User)</Text>
            <Text>Store Income (Model)</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text>{dataVersiAkhir.data.input.kota_kabupaten}</Text>
            <Text>{dataVersiAkhir.data.input.sbu}</Text>
            <Text>{dataVersiAkhir.data.input.kelas_mall}</Text>
            <Text>{`${dataVersiAkhir.data.input.luas_toko.toLocaleString(
              "id-ID"
            )} m2`}</Text>
            <Text>
              {`Rp ${dataVersiAkhir.data.output.user_generated.store_income.toLocaleString(
                "id-ID",
                { maximumFractionDigits: 0 }
              )}`}
            </Text>
            <Text>{`Rp ${dataVersiAkhir.data.output.model_generated.store_income.toLocaleString(
              "id-ID",
              { maximumFractionDigits: 0 }
            )}`}</Text>
          </Grid.Col>
        </Grid>
      </Group>
      <Group mt="md" grow>
        <Button
          variant="outline"
          onClick={() => hapusProposal(popUp.proposalID!)}
        >
          Lanjutkan
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setPopUp((stateSebelumnya) => ({
              ...stateSebelumnya,
              togglePopUp: false,
            }))
          }
        >
          Batal
        </Button>
      </Group>
    </>
  );
};
