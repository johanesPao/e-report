import { Button, Group, useMantineTheme } from "@mantine/core";
import { StatePopUp } from "../PopUp";
import {
  EModePopUpKelayakanTokoBaru,
  ETindakanProposalTokoBaru,
  Formulir,
  IAksenWarnaPopUp,
  IDisabilitasInputKelayakanTokoBaru,
} from "../../fungsi/basic";
import { cekFormValid } from "../../fungsi/halaman/kelayakanTokoBaru";
import { UseFormReturnType } from "@mantine/form";

export const TombolKelayakanTokoBaru = ({
  formulir,
  modeProposal,
  disabilitasTombol,
  popUp,
  temaWarna,
  validasi,
  tindakanPopUp,
  konfirmasiPopUp,
}: {
  formulir: UseFormReturnType<Formulir, (values: Formulir) => Formulir>;
  modeProposal: EModePopUpKelayakanTokoBaru;
  disabilitasTombol: Partial<IDisabilitasInputKelayakanTokoBaru>;
  popUp: React.Dispatch<React.SetStateAction<StatePopUp>>;
  temaWarna: IAksenWarnaPopUp;
  validasi: React.Dispatch<React.SetStateAction<boolean>>;
  tindakanPopUp: React.Dispatch<
    React.SetStateAction<ETindakanProposalTokoBaru>
  >;
  konfirmasiPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const theme = useMantineTheme();

  // set properti teks berdasar mode proposal
  enum ETeks {
    BATAL = "Batal",
    SIMPAN = "Simpan",
    KIRIM = "Kirim",
    TERIMA = "Terima",
    TOLAK = "Tolak",
  }
  interface ITeksTombol {
    satu: ETeks;
    dua: ETeks;
    tiga: ETeks;
  }
  let teksTombol: ITeksTombol = {} as ITeksTombol;
  switch (modeProposal) {
    case EModePopUpKelayakanTokoBaru.PENAMBAHAN:
      teksTombol = {
        satu: ETeks.BATAL,
        dua: ETeks.SIMPAN,
        tiga: ETeks.KIRIM,
      };
      break;
    case EModePopUpKelayakanTokoBaru.SUNTING:
      teksTombol = {
        satu: ETeks.BATAL,
        dua: ETeks.SIMPAN,
        tiga: ETeks.KIRIM,
      };
      break;
    case EModePopUpKelayakanTokoBaru.PERSETUJUAN:
      teksTombol = {
        satu: ETeks.BATAL,
        dua: ETeks.TERIMA,
        tiga: ETeks.TOLAK,
      };
      break;
    default:
      break;
  }

  // set handleTombolDua dan handleTombolTiga berdasar modeProposal
  const handleTombolDua = () => {
    switch (modeProposal) {
      case EModePopUpKelayakanTokoBaru.PENAMBAHAN:
        validasi(cekFormValid(formulir));
        tindakanPopUp(ETindakanProposalTokoBaru.SIMPAN);
        konfirmasiPopUp(true);
        break;
      case EModePopUpKelayakanTokoBaru.SUNTING:
        validasi(cekFormValid(formulir));
        tindakanPopUp(ETindakanProposalTokoBaru.SIMPAN);
        konfirmasiPopUp(true);
        break;
      case EModePopUpKelayakanTokoBaru.PERSETUJUAN:
        validasi(cekFormValid(formulir));
        tindakanPopUp(ETindakanProposalTokoBaru.DITERIMA);
        konfirmasiPopUp(true);
        break;
      default:
        return;
    }
  };
  const handleTombolTiga = () => {
    switch (modeProposal) {
      case EModePopUpKelayakanTokoBaru.PENAMBAHAN:
        validasi(cekFormValid(formulir));
        tindakanPopUp(ETindakanProposalTokoBaru.KIRIM);
        konfirmasiPopUp(true);
        break;
      case EModePopUpKelayakanTokoBaru.SUNTING:
        validasi(cekFormValid(formulir));
        tindakanPopUp(ETindakanProposalTokoBaru.KIRIM);
        konfirmasiPopUp(true);
        break;
      case EModePopUpKelayakanTokoBaru.PERSETUJUAN:
        validasi(cekFormValid(formulir));
        tindakanPopUp(ETindakanProposalTokoBaru.DITOLAK);
        konfirmasiPopUp(true);
        break;
      default:
        return;
    }
  };

  return (
    <Group grow spacing="lg">
      <Button
        variant="outline"
        onClick={() =>
          popUp((stateSebelumnya) => ({
            ...stateSebelumnya,
            togglePopUp: false,
            judulPopUp: "",
            // dataPopUp: undefined,
          }))
        }
        styles={{
          root: {
            color: temaWarna.tombolBatal.utama,
            borderColor: temaWarna.tombolBatal.utama,
            ...theme.fn.hover({
              backgroundColor: temaWarna.tombolBatal.hover.background,
              color: temaWarna.tombolBatal.hover.teks,
            }),
          },
          label: {
            fontSize: "20px",
          },
        }}
        disabled={disabilitasTombol.tombol_satu}
      >
        {teksTombol.satu}
      </Button>
      <Button
        variant="outline"
        onClick={handleTombolDua}
        styles={{
          root: {
            color: temaWarna.tombolSimpan.utama,
            borderColor: temaWarna.tombolSimpan.utama,
            ...theme.fn.hover({
              backgroundColor: temaWarna.tombolSimpan.hover.background,
              color: temaWarna.tombolSimpan.hover.teks,
            }),
          },
          label: {
            fontSize: "20px",
          },
        }}
        type="submit"
        disabled={disabilitasTombol.tombol_dua}
      >
        {teksTombol.dua}
      </Button>
      <Button
        variant="outline"
        onClick={handleTombolTiga}
        styles={{
          root: {
            color: temaWarna.tombolKirim.utama,
            borderColor: temaWarna.tombolKirim.utama,
            ...theme.fn.hover({
              backgroundColor: temaWarna.tombolKirim.hover.background,
              color: temaWarna.tombolKirim.hover.teks,
            }),
          },
          label: {
            fontSize: "20px",
          },
        }}
        type="submit"
        disabled={disabilitasTombol.tombol_tiga}
      >
        {teksTombol.tiga}
      </Button>
    </Group>
  );
};
