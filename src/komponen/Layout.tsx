import { AppShell } from "@mantine/core";
import { NavbarMod } from "./Navbar";

function Layout({ children }: { children: any }) {
  return (
    <AppShell
      padding="md"
      fixed
      navbar={<NavbarMod />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <div style={{ padding: 0, margin: 0 }}>{children}</div>
    </AppShell>
  );
}

export default Layout;
