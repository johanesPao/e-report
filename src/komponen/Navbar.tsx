import { ScrollArea, Navbar, Box, Menu, useMantineTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import {
  IconLogout,
  IconMessageCircle,
  IconSettings,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../state/hook";
import { appWindow } from "@tauri-apps/api/window";

import { NavigasiPengguna } from "./kontenNavbar/NavigasiPengguna";
import { NavLinks } from "./kontenNavbar/Navlink";
import { resetAplikasi } from "../fungsi/basic";

function NavbarMod({
  onNavlinkClick,
}: {
  onNavlinkClick: (halamanBaru: string) => void;
}) {
  const theme = useMantineTheme();
  const navigasi = useNavigate();
  const dispatch = useAppDispatch();
  const headerHeight = 50;
  const { height } = useViewportSize();

  const keluarAkun = () => {
    resetAplikasi(dispatch);
    navigasi("/");
  };

  const keluarAplikasi = () => {
    resetAplikasi(dispatch);
    appWindow.close();
  };

  return (
    <Navbar height={`${height - headerHeight}`} p="xs" width={{ base: 330 }}>
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
