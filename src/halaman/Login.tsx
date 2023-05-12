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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX, IconCheck, IconUser, IconPassword } from "@tabler/icons-react";
import LogRocket from "logrocket";

import {
  setProsesAuth,
  setAuthGagal,
  setSesiAktif,
  getAuthGagal,
  getSesiAktif,
  getProsesAuth,
} from "../fitur_state/event";
import { setNamaPengguna, setEmailPengguna } from "../fitur_state/pengguna";
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
  const sesiAktif = useAppSelector(getSesiAktif);
  const authGagal = useAppSelector(getAuthGagal);
  const prosesAuth = useAppSelector(getProsesAuth);
  const [nama, setNama] = useState("");
  const [kataKunci, setKataKunci] = useState("");
  const navigasi = useNavigate();

  useEffect(() => {
    if (sesiAktif) {
      navigasi("konten");
    }
  }, [sesiAktif, navigasi]);

  const prosesLogin = async () => {
    dispatch(setAuthGagal(false));
    dispatch(setProsesAuth(true));
    let respon: string = await invoke("login", {
      nama: nama,
      kataKunci,
    });
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
      LogRocket.identify(nama, {
        name: nama,
        email: hasil["email"],
      });
      console.log(hasil);
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
          placeholder="Nama Pengguna"
          icon={<IconUser size="0.8rem" color={theme.colors.teal[5]} />}
          size="sm"
          value={nama}
          error={authGagal}
          disabled={prosesAuth}
          onChange={(e) => setNama(e.currentTarget.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
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
        <Button
          fullWidth
          mt={32}
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
          onClick={() => appWindow.close()}
        >
          Tutup
        </Button>
      </Paper>
    </div>
  );
};

export default Login;
