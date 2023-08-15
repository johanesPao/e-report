import { Modal, Title, useMantineTheme } from "@mantine/core";
import { StateKelayakanTokoBaru } from "../fungsi/halaman/kelayakanTokoBaru";
import { useAppSelector } from "../state/hook";
import { getHalaman } from "../fitur_state/event";
import { InputPopUpKelayakanTokoBaru } from "./kontenPopUp/InputPopUpKelayakanTokoBaru";
import { EModePopUpKelayakanTokoBaru, IAksenWarnaPopUp } from "../fungsi/basic";

export const PopUp = ({
  props,
  setProps,
}: {
  props: StateKelayakanTokoBaru;
  setProps: React.Dispatch<React.SetStateAction<StateKelayakanTokoBaru>>;
}) => {
  const theme = useMantineTheme();
  const halaman = useAppSelector(getHalaman);
  // default aksenWarna
  let aksenWarna: IAksenWarnaPopUp = {
    header: theme.colors.blue[9],
    mayor: theme.colors.blue[5],
    minor: theme.colors.blue[1],
    teksLoading: theme.colors.gray[7],
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
  switch (props.popUp.modePopUp) {
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
    // EModePopUpKelayakanTokoBaru.PENAMBAHAN menggunakan aksenWarna default
    default:
      break;
  }

  const renderInput = () => {
    switch (halaman) {
      case "kelayakanTokoBaru":
        // return PopUp Toko Baru
        return (
          <InputPopUpKelayakanTokoBaru
            props={props}
            setProps={setProps}
            aksenWarna={aksenWarna}
          />
        );
      default: {
        return null;
      }
    }
  };

  return (
    <Modal.Root
      opened={props.popUp.togglePopUp}
      onClose={() =>
        setProps((stateSebelumnya) => ({
          ...stateSebelumnya,
          popUp: {
            togglePopUp: false,
            judulPopUp: "",
            dataPopUp: undefined,
          },
        }))
      }
      size="100%"
      centered
      transitionProps={{ transition: "slide-down", duration: 500 }}
      radius="md"
    >
      <Modal.Overlay blur={1} />
      <Modal.Content>
        <Modal.Header sx={{ backgroundColor: aksenWarna.header }} p={10}>
          <Modal.Title>
            <Title order={4} color="white">
              {props.popUp.judulPopUp}
            </Title>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body m={15}>{renderInput()}</Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
