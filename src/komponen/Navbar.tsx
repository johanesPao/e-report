import { ScrollArea, Navbar, Box } from "@mantine/core";
import { NavigasiPengguna } from "./NavigasiPengguna";
import { NavLinks } from "./Navlink";
import { useViewportSize } from "@mantine/hooks";

export function NavbarMod() {
  const { height } = useViewportSize();

  return (
    <Navbar height={`${height}`} p="xs" width={{ base: 300 }}>
      <Navbar.Section mt="xs">Tes</Navbar.Section>
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <Box py="md">
          <NavLinks />
        </Box>
      </Navbar.Section>
      <Navbar.Section>
        <NavigasiPengguna />
      </Navbar.Section>
    </Navbar>
  );
}
