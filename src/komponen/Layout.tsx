import { AppShell, Header } from "@mantine/core";
import NavbarMod from "./Navbar";

function Layout({
  children,
  onNavbarLinkClick,
}: {
  children: React.ReactNode;
  onNavbarLinkClick: (halamanBaru: string) => void;
}) {
  return (
    <>
      <AppShell
        padding="md"
        fixed
        navbar={<NavbarMod onNavlinkClick={onNavbarLinkClick} />}
        header={
          <Header height={50} p="xs">
            e-Report
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        {/* <div
          id="#drawer-area"
          style={{ width: "100px", padding: 0, margin: 0 }}
        > */}
        {children}
        {/* </div> */}
      </AppShell>
    </>
  );
}

export default Layout;
