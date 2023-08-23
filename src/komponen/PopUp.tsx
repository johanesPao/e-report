import { Modal, Title, useMantineTheme } from "@mantine/core";
import { StateKelayakanTokoBaru } from "../fungsi/halaman/kelayakanTokoBaru";
import { useAppSelector } from "../state/hook";
import { getHalaman } from "../fitur_state/event";
import { InputPopUpKelayakanTokoBaru } from "./kontenPopUp/InputPopUpKelayakanTokoBaru";
import {
  DataKelayakanTokoBaru,
  EHalaman,
  EModePopUpKelayakanTokoBaru,
  IAksenWarnaPopUp,
} from "../fungsi/basic";
import { HapusProposal } from "./kontenPopUp/HapusProposal";

export interface StatePopUp {
  togglePopUp: boolean;
  judulPopUp?: string;
  modeProposal?: EModePopUpKelayakanTokoBaru;
  proposalID?: string;
}

export const PopUp = ({
  data,
  props,
  popUp,
  setPopUp,
}: {
  data: DataKelayakanTokoBaru[];
  props: StateKelayakanTokoBaru;
  popUp: StatePopUp;
  setPopUp: React.Dispatch<React.SetStateAction<StatePopUp>>;
}) => {
  const theme = useMantineTheme();
  const halaman = useAppSelector(getHalaman);
  // ukuranWindow
  let ukuranWindow = "100%";
  switch (halaman) {
    case EHalaman.KELAYAKAN_TOKO_BARU:
      switch (popUp.modeProposal) {
        case EModePopUpKelayakanTokoBaru.HAPUS:
          ukuranWindow = "auto";
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
  // default aksenWarna
  let aksenWarna: IAksenWarnaPopUp = {
    header: theme.colors.blue[9],
    mayor: theme.colors.blue[5],
    minor: theme.colors.blue[1],
    teksLoading: theme.colors.gray[7],
    background: theme.colors.dark[8],
    judul: {
      teks: theme.colors.gray[0],
    },
    disable: {
      mayor: theme.colors.dark[5],
      mid: theme.colors.dark[3],
      minor: theme.colors.dark[2],
    },
    kelasMall: {
      kelasSatu: theme.colors.lime[7],
      kelasDua: theme.colors.yellow[7],
      kelasTiga: theme.colors.orange[7],
      kelasEmpat: theme.colors.red[7],
    },
    tombolBatal: {
      utama: theme.colors.red[8],
      hover: {
        background: theme.colors.red[8],
        teks: theme.colors.dark[9],
      },
    },
    tombolSimpan: {
      utama: theme.colors.blue[8],
      hover: {
        background: theme.colors.blue[8],
        teks: theme.colors.dark[9],
      },
    },
    tombolKirim: {
      utama: theme.colors.green[8],
      hover: {
        background: theme.colors.green[8],
        teks: theme.colors.dark[9],
      },
    },
  };

  // Modifikasi aksen warna
  switch (popUp.modeProposal) {
    case EModePopUpKelayakanTokoBaru.SUNTING:
      aksenWarna = {
        ...aksenWarna,
        header: theme.colors.orange[9],
        mayor: theme.colors.orange[5],
        minor: theme.colors.orange[1],
      };
      break;
    case EModePopUpKelayakanTokoBaru.HAPUS:
      aksenWarna = {
        ...aksenWarna,
        header: theme.colors.red[9],
        mayor: theme.colors.red[5],
        minor: theme.colors.red[1],
        background: theme.colors.red[9],
        judul: {
          teks: theme.colors.gray[0],
        },
      };
      break;
    case EModePopUpKelayakanTokoBaru.PERSETUJUAN:
      aksenWarna = {
        ...aksenWarna,
        header: theme.colors.lime[9],
        mayor: theme.colors.lime[5],
        minor: theme.colors.lime[1],
      };
      break;
    default:
      break;
  }

  const renderInput = () => {
    switch (halaman) {
      // PopUp pada Kelayakan Toko Baru
      case "kelayakanTokoBaru":
        switch (popUp.modeProposal) {
          // jika mode penghapusan proposal
          case EModePopUpKelayakanTokoBaru.HAPUS:
            return (
              <HapusProposal data={data} popUp={popUp} setPopUp={setPopUp} />
            );
          // mode lainnya dalam kelayakanTokoBaru
          case EModePopUpKelayakanTokoBaru.PENAMBAHAN:
          case EModePopUpKelayakanTokoBaru.SUNTING:
          case EModePopUpKelayakanTokoBaru.PERSETUJUAN:
            return (
              <InputPopUpKelayakanTokoBaru
                data={data}
                props={props}
                aksenWarna={aksenWarna}
                popUp={popUp}
                setPopUp={setPopUp}
              />
            );
          default:
            return null;
        }
      // PopUp pada halaman lainnya
      default: {
        return null;
      }
    }
  };

  return (
    <>
      <Modal.Root
        opened={popUp.togglePopUp}
        onClose={() =>
          setPopUp((stateSebelumnya) => ({
            ...stateSebelumnya,
            togglePopUp: false,
          }))
        }
        size={ukuranWindow}
        centered
        transitionProps={{ transition: "slide-down", duration: 300 }}
        radius="md"
      >
        <Modal.Overlay blur={1} />
        <Modal.Content>
          <Modal.Header sx={{ backgroundColor: aksenWarna.header }} p={10}>
            <Modal.Title>
              <Title order={4} color={aksenWarna.judul.teks}>
                {popUp.judulPopUp}
              </Title>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body p={15} sx={{ backgroundColor: aksenWarna.background }}>
            {renderInput()}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
