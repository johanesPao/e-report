import {
  ScrollArea,
  Navbar,
  Box,
  Menu,
  useMantineTheme,
  Center,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import {
  IconLogout,
  IconMessageCircle,
  IconSettings,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../state/hook";
import { appWindow } from "@tauri-apps/api/window";

import { NavigasiPengguna } from "./NavigasiPengguna";
import { NavLinks } from "./Navlink";
import { setSesiAktif, setKonekKeBC } from "../fitur_state/event";
import {
  setEmailPengguna,
  setNamaPengguna,
  setDepartemenPengguna,
  setPeranPengguna,
} from "../fitur_state/pengguna";

function NavbarMod({
  onNavlinkClick,
}: {
  onNavlinkClick: (halamanBaru: string) => void;
}) {
  const theme = useMantineTheme();
  const navigasi = useNavigate();
  const dispatch = useAppDispatch();
  const { height } = useViewportSize();

  const resetAplikasi = () => {
    dispatch(setSesiAktif(false));
    dispatch(setNamaPengguna(""));
    dispatch(setEmailPengguna(""));
    dispatch(setDepartemenPengguna(""));
    dispatch(setPeranPengguna(""));
    dispatch(setKonekKeBC(false));
  };

  const keluarAkun = () => {
    resetAplikasi();
    navigasi("/");
  };

  const keluarAplikasi = () => {
    resetAplikasi();
    appWindow.close();
  };

  return (
    <Navbar height={`${height}`} p="xs" width={{ base: 330 }}>
      <Navbar.Section mt="xs">
        <Box>
          <Center sx={{ fontSize: "30px" }}>e-Report</Center>
        </Box>
      </Navbar.Section>
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <Box py="md">
          <NavLinks onLinkClick={onNavlinkClick} />
        </Box>
      </Navbar.Section>
      <Menu
        trigger="hover"
        openDelay={150}
        closeDelay={350}
        position="top-start"
        offset={10}
        transitionProps={{ transition: "slide-up", duration: 400 }}
        width={310}
      >
        <Menu.Target>
          <Navbar.Section>
            <NavigasiPengguna />
          </Navbar.Section>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Akun</Menu.Label>
          <Menu.Item icon={<IconSettings size={14} />}>Pengaturan</Menu.Item>
          <Menu.Item icon={<IconMessageCircle size={14} />}>
            Notifikasi
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>Aplikasi</Menu.Label>
          <Menu.Item
            icon={<IconLogout size={14} />}
            color={theme.colors.red[9]}
            onClick={keluarAkun}
          >
            Logout Akun
          </Menu.Item>
          <Menu.Item
            icon={<IconLogout size={14} />}
            color={theme.colors.red[9]}
            onClick={keluarAplikasi}
          >
            Tutup Aplikasi
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Navbar>
  );
}

export default NavbarMod;
