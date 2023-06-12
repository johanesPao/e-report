import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../state/hook";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  rem,
  useMantineTheme,
  Switch,
  Center,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX, IconCheck, IconUser, IconPassword } from "@tabler/icons-react";
import LogRocket from "logrocket";

import {
  setProsesAuth,
  setAuthGagal,
  setSesiAktif,
  setIndeksData,
  getAuthGagal,
  getProsesAuth,
  setKonekKeBC,
  getKonekKeBC,
} from "../fitur_state/event";
import {
  setNamaPengguna,
  setEmailPengguna,
  setDepartemenPengguna,
  setPeranPengguna,
  setCompPengguna,
  setCompKueri,
} from "../fitur_state/pengguna";
import {
  DataMultiSelect,
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
  lokasiLabel,
  brandLabel,
  mcLabel,
  klasifikasiLabel,
  regionLabel,
} from "../fungsi/bc";
import latar1 from "../aset/gambar/shoe1.jpg";
import latar2 from "../aset/gambar/shoe2.jpg";
import latar3 from "../aset/gambar/shoe3.jpg";
import latar4 from "../aset/gambar/shoe4.jpg";
import { resetAplikasi } from "../fungsi/basic";

const kolamGambar: string[] = [latar1, latar2, latar3, latar4];
let gambarAcak: number = Math.floor(Math.random() * kolamGambar.length);

const useStyles = createStyles((theme) => ({
  background: {
    height: "100vh",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(${kolamGambar[gambarAcak]})`,
    backgroundPositionX: gambarAcak == 3 ? 600 : 600,
    overflow: "hidden",
  },

  formulir: {
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: "100vh",
    maxWidth: "50vw",
    paddingTop: rem(80),
    right: "0",
  },

  judul: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
}));

const Login = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const dispatch = useAppDispatch();
  const authGagal = useAppSelector(getAuthGagal);
  const prosesAuth = useAppSelector(getProsesAuth);
  const [nama, setNama] = useState("");
  const [kataKunci, setKataKunci] = useState("");
  const navigasi = useNavigate();
  const konekKeBC = useAppSelector(getKonekKeBC);
  const [bcTersedia, setBCTersedia] = useState(false);
  const [koneksiBC, toggleKoneksiBC] = useState(false);

  const bc_tersedia = async () => {
    try {
      const respon: string = await invoke("cek_koneksi_bc");
      const hasil = JSON.parse(respon);
      if (!hasil["status"]) {
        toggleKoneksiBC(false);
        setBCTersedia(false);
      } else {
        toggleKoneksiBC(true);
        setBCTersedia(true);
      }
    } catch (e) {
      toggleKoneksiBC(false);
      setBCTersedia(false);
    }
  };

  const muatBrand = async (
    compPengguna: string[],
    parameterBc: { [key: string]: { [key: string]: string } }
  ) => {
    const arrayBrandLabel: DataMultiSelect[][] = [];
    if (compPengguna.length === 1) {
      const respon = await brandLabel(
        parameterBc,
        parameterBc.tabel_bc[`${compPengguna[0].toLowerCase()}`]
      );
      if (respon !== undefined && respon.length !== 0) {
        arrayBrandLabel.push(respon);
        dispatch(setParameterBrand(arrayBrandLabel));
      }
    } else {
      const brandLabelPromises = compPengguna.map(async (comp) => {
        const respon = await brandLabel(
          parameterBc,
          parameterBc.tabel_bc[`${comp.toLowerCase()}`]
        );
        if (respon !== undefined && respon.length !== 0) {
          return respon;
        }
      });

      const brandLabelJamak = await Promise.all(brandLabelPromises);
      const brandLabelValid = brandLabelJamak.filter(
        (hasil): hasil is DataMultiSelect[] => hasil !== undefined
      );
      arrayBrandLabel.push(...brandLabelValid);
      dispatch(setParameterBrand(arrayBrandLabel));
    }
  };

  const muatMC = async (
    compPengguna: string[],
    parameterBc: { [key: string]: { [key: string]: string } }
  ) => {
    if (compPengguna.length === 1) {
      const respon = await mcLabel(
        parameterBc,
        parameterBc.tabel_bc[`${compPengguna[0].toLowerCase()}`]
      );
      if (respon !== undefined && respon.length !== 0) {
        dispatch(setParameterDiv([respon[0][0]]));
        dispatch(setParameterGroup([respon[0][1]]));
        dispatch(setParameterCat([respon[0][2]]));
      }
    } else {
      const mcLabelPromises = compPengguna.map(async (comp) => {
        const respon = await mcLabel(
          parameterBc,
          parameterBc.tabel_bc[`${comp.toLocaleLowerCase()}`]
        );
        if (respon !== undefined && respon.length !== 0) {
          return respon;
        }
      });

      const mcLabelJamak = await Promise.all(mcLabelPromises);
      const mcLabelValid = mcLabelJamak.filter(
        (hasil): hasil is DataMultiSelect[][][] => hasil !== undefined
      );
      dispatch(setParameterDiv([mcLabelValid[0][0][0], mcLabelValid[1][0][0]]));
      dispatch(
        setParameterGroup([mcLabelValid[0][0][1], mcLabelValid[1][0][1]])
      );
      dispatch(setParameterCat([mcLabelValid[0][0][2], mcLabelValid[1][0][2]]));
    }
  };

  const muatLokasi = async (
    compPengguna: string[],
    parameterBc: { [key: string]: { [key: string]: string } }
  ) => {
    const respon = await lokasiLabel(
      parameterBc,
      parameterBc.tabel_bc[
        `${
          compPengguna.length === 1
            ? compPengguna[0].toLowerCase()
            : compPengguna[
                compPengguna.indexOf(parameterBc.comp.pri)
              ].toLowerCase()
        }`
      ]
    );
    if (respon !== undefined && respon.length !== 0) {
      dispatch(setParameterLokasi(respon));
    }
  };

  const muatKlasifikasi = async (
    compPengguna: string[],
    parameterBc: { [key: string]: { [key: string]: string } }
  ) => {
    const respon = await klasifikasiLabel(
      parameterBc,
      parameterBc.tabel_bc[
        `${
          compPengguna.length === 1
            ? compPengguna[0].toLowerCase()
            : compPengguna[
                compPengguna.indexOf(parameterBc.comp.pnt)
              ].toLowerCase()
        }`
      ]
    );
    if (respon !== undefined && respon.length !== 0) {
      dispatch(setParameterKlasifikasi(respon));
    }
  };

  const muatRegion = async (
    compPengguna: string[],
    parameterBc: { [key: string]: { [key: string]: string } }
  ) => {
    const respon = await regionLabel(
      parameterBc,
      parameterBc.tabel_bc[
        `${
          compPengguna.length === 1
            ? compPengguna[0].toLowerCase()
            : compPengguna[
                compPengguna.indexOf(parameterBc.comp.pnt)
              ].toLowerCase()
        }`
      ]
    );
    if (respon !== undefined && respon.length !== 0) {
      dispatch(setParameterRegion(respon));
    }
  };

  useEffect(() => {
    // reset semua state
    resetAplikasi(dispatch);
    bc_tersedia();
  }, []);

  const prosesLogin = async () => {
    dispatch(setAuthGagal(false));
    dispatch(setProsesAuth(true));
    let respon: string;
    try {
      respon = await invoke("login", {
        nama: nama,
        kataKunci,
      });
    } catch (error) {
      console.error(error);
      dispatch(setProsesAuth(false));
      dispatch(setAuthGagal(true));
      setNama("");
      setKataKunci("");
      notifications.show({
        title: "Login Gagal",
        message: "Terjadi kesalahan saat melakukan koneksi ke mongodb.",
        autoClose: 5000,
        color: "red",
        icon: <IconX size="1.1rem" />,
        withCloseButton: false,
      });
      return;
    }

    let hasil = JSON.parse(respon);
    if (Object.keys(hasil).length === 0) {
      dispatch(setAuthGagal(true));
      setNama("");
      setKataKunci("");
      dispatch(setProsesAuth(false));
      notifications.show({
        title: "Login Gagal",
        message: `Nama Pengguna tidak terdaftar.`,
        autoClose: 5000,
        color: "red",
        icon: <IconX size="1.1rem" />,
        withCloseButton: false,
      });
    } else {
      dispatch(setAuthGagal(false));
      dispatch(setSesiAktif(true));
      dispatch(setNamaPengguna(nama));
      dispatch(setEmailPengguna(hasil.email));
      dispatch(setDepartemenPengguna(hasil.departemen));
      dispatch(setPeranPengguna(hasil.peran));
      dispatch(setCompPengguna(hasil.comp));
      if (koneksiBC) {
        dispatch(setKonekKeBC(true));
        let parameterBc;
        // inisiasi data param BC
        try {
          const respon: string = await invoke("inisiasi_bc_ereport");
          parameterBc = JSON.parse(respon);
          if (parameterBc.status) {
            dispatch(setParameterBc(parameterBc.konten));
            if (hasil.comp.length === 1) {
              dispatch(
                setCompKueri(
                  parameterBc.konten.tabel_bc[`${hasil.comp[0].toLowerCase()}`]
                )
              );
            } else {
              dispatch(setIndeksData(0));
            }
            try {
              // inisiasi data brand
              await muatBrand(hasil.comp, parameterBc.konten);
              // inisiasi data mc
              await muatMC(hasil.comp, parameterBc.konten);
              // inisiasi data Lokasi & SBU jika PRI
              if (
                (hasil.comp.length === 1 &&
                  hasil.comp[0] === parameterBc.konten.comp.pri) ||
                hasil.comp.includes(parameterBc.konten.comp.pri)
              ) {
                let arraySBU: DataMultiSelect[] = [];
                parameterBc.konten.sbu.map((sbu: string) => {
                  arraySBU.push({ label: sbu, value: sbu });
                });
                dispatch(setParameterSBU(arraySBU));
                await muatLokasi(hasil.comp, parameterBc.konten);
              }
              // inisiasi data Klasifikasi & Region jika PNT
              if (
                (hasil.comp.length === 1 &&
                  hasil.comp[0] === parameterBc.konten.comp.pnt) ||
                hasil.comp.includes(parameterBc.konten.comp.pnt)
              ) {
                await muatKlasifikasi(hasil.comp, parameterBc.konten);
                await muatRegion(hasil.comp, parameterBc.konten);
              }
            } catch (e) {
              resetAplikasi(dispatch);
              notifications.show({
                title: "Kesalahan",
                message: `Terjadi kesalahan dalam proses inisiasi data: [${e}]`,
                autoClose: 3000,
                color: "red",
                icon: <IconX size="1.1rem" />,
                withCloseButton: false,
              });
            }
          } else {
            console.log("Gagal menyimpan parameter BC ke dalam redux.");
            return;
          }
        } catch (e) {
          console.log(`Gagal memuat parameter BC dari back-end. ${e}`);
        }
      }
      LogRocket.identify(nama, {
        name: nama,
        email: hasil.email,
        departemen: hasil.departemen,
        peran: hasil.peran,
      });
      notifications.show({
        title: "Login Sukses",
        message: `Selamat datang kembali ${nama} di e-Report!`,
        autoClose: 5000,
        color: "teal",
        icon: <IconCheck size="1.1rem" />,
        withCloseButton: false,
      });
      dispatch(setProsesAuth(false));
      navigasi("konten");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      prosesLogin();
    }
  };

  const handleTutupAplikasi = async () => {
    dispatch(setAuthGagal(false));
    dispatch(setProsesAuth(false));
    dispatch(setNamaPengguna(""));
    dispatch(setEmailPengguna(""));
    dispatch(setDepartemenPengguna(""));
    dispatch(setPeranPengguna(""));
    dispatch(setCompPengguna([]));
    if (konekKeBC) {
      dispatch(setKonekKeBC(false));
      dispatch(setParameterBc({}));
    }
    appWindow.close();
  };

  return (
    <div className={classes.background}>
      <Paper className={classes.formulir} radius={0} p={250}>
        <Title order={2} className={classes.judul} ta="center" mt="md">
          e-Report
        </Title>
        <Text ta="center">PT Prestasi Retail Innovation</Text>
        <Text ta="center" mb={50}>
          PT Panatrade Caraka
        </Text>

        <TextInput
          data-autofocus
          placeholder="Nama Pengguna"
          icon={<IconUser size="0.8rem" color={theme.colors.teal[5]} />}
          size="sm"
          value={nama}
          error={authGagal}
          disabled={prosesAuth}
          onChange={(e) => setNama(e.currentTarget.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <p>{bcTersedia}</p>
        <PasswordInput
          placeholder="Kata Kunci"
          icon={<IconPassword size="0.8rem" color={theme.colors.teal[5]} />}
          mt="md"
          size="sm"
          value={kataKunci}
          error={authGagal}
          disabled={prosesAuth}
          onChange={(e) => setKataKunci(e.currentTarget.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <Tooltip
          label={
            bcTersedia
              ? "Hubungkan aplikasi dengan BC?"
              : "Tidak dapat terhubung dengan BC pada jaringan yang anda gunakan."
          }
          color="orange"
          withArrow
        >
          <Center>
            <Switch
              mt={15}
              size="md"
              label="Hubungkan ke BC"
              disabled={!bcTersedia || prosesAuth}
              checked={koneksiBC}
              thumbIcon={
                koneksiBC ? (
                  <IconCheck
                    size="0.8rem"
                    color={theme.colors.teal[theme.fn.primaryShade()]}
                    stroke={3}
                  />
                ) : (
                  <IconX
                    size="0.8rem"
                    color={theme.colors.red[theme.fn.primaryShade()]}
                    stroke={3}
                  />
                )
              }
              onChange={() => toggleKoneksiBC(!koneksiBC)}
            />
          </Center>
        </Tooltip>
        <Button
          fullWidth
          mt={15}
          size="xl"
          onClick={prosesLogin}
          loading={prosesAuth}
        >
          Masuk
        </Button>
        <Button
          fullWidth
          mt={12}
          size="xl"
          style={{ backgroundColor: theme.colors.red[7] }}
          disabled={prosesAuth}
          onClick={() => handleTutupAplikasi()}
        >
          Tutup
        </Button>
      </Paper>
    </div>
  );
};

export default Login;
