import {
  AppShell,
  Group,
  Header,
  ScrollArea,
  Switch,
  createStyles,
  rem,
} from "@mantine/core";
import NavbarMod from "./Navbar";
import { useAppDispatch, useAppSelector } from "../state/hook";
import { getCompPengguna } from "../fitur_state/pengguna";
import { getHalaman, getIndeksData, setIndeksData } from "../fitur_state/event";
import { useState } from "react";
import { useViewportSize } from "@mantine/hooks";
import { EHalaman } from "../fungsi/basic";

function Layout({
  children,
  onNavbarLinkClick,
}: {
  children: React.ReactNode;
  onNavbarLinkClick: (halamanBaru: string) => void;
}) {
  const compPengguna = useAppSelector(getCompPengguna);
  const halaman = useAppSelector(getHalaman);
  const dispatch = useAppDispatch();
  const [comp, toggleComp] = useState(false);
  // pada halaman ini, kunci switch
  const kunciSwitch = [
    EHalaman.KETERSEDIAAN_STOK.toString(),
    EHalaman.BUYING_PROPOSAL.toString(),
    EHalaman.KELAYAKAN_TOKO_BARU.toString(),
  ];

  const useStyles = createStyles(() => ({
    inner: {
      height: rem(25),
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
    },
  }));
  const { classes } = useStyles();

  const indeksData = useAppSelector(getIndeksData);

  const set_comp = (e: boolean) => {
    toggleComp(e);
    if (e) {
      dispatch(setIndeksData(1));
    } else {
      dispatch(setIndeksData(0));
    }
  };

  const { height } = useViewportSize();

  return (
    <>
      <AppShell
        padding="md"
        fixed
        navbar={<NavbarMod onNavlinkClick={onNavbarLinkClick} />}
        header={
          <Header height={50} p="xs">
            <div className={classes.inner}>
              e-Report
              {compPengguna.length !== 1 && (
                <Group position="right">
                  <Switch
                    onLabel={compPengguna[1]}
                    offLabel={compPengguna[0]}
                    value={indeksData}
                    size="xl"
                    color="red"
                    checked={comp}
                    onChange={(event) => set_comp(event.currentTarget.checked)}
                    disabled={kunciSwitch.includes(halaman)}
                  />
                </Group>
              )}
            </div>
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            paddingTop: 50,
            paddingLeft: 330,
            paddingRight: 0,
            paddingBottom: 0,
          },
        })}
      >
        <ScrollArea h={height - 50} p={0} m={0}>
          {children}
        </ScrollArea>
      </AppShell>
    </>
  );
}

export default Layout;
