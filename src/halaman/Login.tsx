import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { invoke } from "@tauri-apps/api/tauri";
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  rem,
} from "@mantine/core";

import {
  setProsesAuth,
  setAuthGagal,
  setSesiAktif,
  getAuthGagal,
  getSesiAktif,
} from "../fitur_state/event";
import { setNamaPengguna } from "../fitur_state/pengguna";
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
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const sesiAktif = useSelector(getSesiAktif);
  const authGagal = useSelector(getAuthGagal);
  const [nama, setNama] = useState("");
  const [kataKunci, setKataKunci] = useState("");
  const navigasi = useNavigate();

  if (sesiAktif) {
    navigasi("dashboard");
  }

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
    } else {
      setAuthGagal(false);
      setSesiAktif(true);
      dispatch(setNamaPengguna(nama));
      navigasi("dashboard");
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
          label="Nama Pengguna"
          size="sm"
          value={nama}
          onChange={(e) => setNama(e.currentTarget.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <PasswordInput
          label="Kata Kunci"
          mt="md"
          size="sm"
          value={kataKunci}
          onChange={(e) => setKataKunci(e.currentTarget.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <Button fullWidth mt={32} size="xl" onClick={prosesLogin}>
          Masuk
        </Button>

        <Text ta="center" mt="md">
          {authGagal && "Nama Pengguna tidak terdaftar"}
        </Text>
      </Paper>
    </div>
  );
};

export default Login;
