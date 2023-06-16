import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../state/hook";
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
import { IconX, IconCheck, IconUser, IconPassword } from "@tabler/icons-react";

import {
  bcDalamJangkauan,
  handleKeyDown,
  handleTutupAplikasi,
  prosesLogin,
} from "../fungsi/halaman/login";
import {
  getAuthGagal,
  getProsesAuth,
  getKonekKeBC,
} from "../fitur_state/event";
import latar1 from "../aset/gambar/shoe1.jpg";
import latar2 from "../aset/gambar/shoe2.jpg";
import latar3 from "../aset/gambar/shoe3.jpg";
import latar4 from "../aset/gambar/shoe4.jpg";
import { useNavigate } from "react-router-dom";

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
  const konekKeBC = useAppSelector(getKonekKeBC);
  const [bcTersedia, setBCTersedia] = useState(false);
  const [koneksiBC, toggleKoneksiBC] = useState(false);
  const navigasi = useNavigate();

  useEffect(() => {
    // reset semua state
    // resetAplikasi(dispatch);
    bcDalamJangkauan(toggleKoneksiBC, setBCTersedia);
  }, []);

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
          onKeyDown={(e) =>
            handleKeyDown(
              e,
              dispatch,
              nama,
              kataKunci,
              setNama,
              setKataKunci,
              koneksiBC,
              navigasi
            )
          }
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
          onKeyDown={(e) =>
            handleKeyDown(
              e,
              dispatch,
              nama,
              kataKunci,
              setNama,
              setKataKunci,
              koneksiBC,
              navigasi
            )
          }
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
          onClick={() =>
            prosesLogin(
              dispatch,
              nama,
              kataKunci,
              setNama,
              setKataKunci,
              koneksiBC,
              navigasi
            )
          }
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
          onClick={() => handleTutupAplikasi(dispatch, konekKeBC)}
        >
          Tutup
        </Button>
      </Paper>
    </div>
  );
};

export default Login;
