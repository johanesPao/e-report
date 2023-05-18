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
} from "../fitur_state/pengguna";
import { setParameterBC, resetParameterBC } from "../fitur_state/dataParam";
import latar1 from "../aset/gambar/shoe1.jpg";
import latar2 from "../aset/gambar/shoe2.jpg";
import latar3 from "../aset/gambar/shoe3.jpg";
import latar4 from "../aset/gambar/shoe4.jpg";

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

  useEffect(() => {
    // reset semua state
    dispatch(setSesiAktif(false));
    dispatch(setAuthGagal(false));
    dispatch(setProsesAuth(false));
    dispatch(setNamaPengguna(""));
    dispatch(setEmailPengguna(""));
    dispatch(setDepartemenPengguna(""));
    dispatch(setPeranPengguna(""));
    dispatch(setCompPengguna([]));

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
    dispatch(setProsesAuth(false));
    if (Object.keys(hasil).length === 0) {
      dispatch(setAuthGagal(true));
      setNama("");
      setKataKunci("");
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
      dispatch(setEmailPengguna(hasil["email"]));
      dispatch(setDepartemenPengguna(hasil["departemen"]));
      dispatch(setPeranPengguna(hasil["peran"]));
      dispatch(setCompPengguna(hasil["comp"]));
      if (koneksiBC) {
        dispatch(setKonekKeBC(true));
        // inisiasi data param BC
        try {
          const respon: string = await invoke("inisiasi_bc_ereport");
          const parameterBC = JSON.parse(respon);
          if (parameterBC["status"]) {
            dispatch(setParameterBC(parameterBC["konten"]));
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
        email: hasil["email"],
        departemen: hasil["departemen"],
        peran: hasil["peran"],
      });
      notifications.show({
        title: "Login Sukses",
        message: `Selamat datang kembali ${nama} di e-Report!`,
        autoClose: 5000,
        color: "teal",
        icon: <IconCheck size="1.1rem" />,
        withCloseButton: false,
      });
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
      dispatch(resetParameterBC());
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
