import {
  AppShell,
  Group,
  Header,
  Switch,
  createStyles,
  rem,
} from "@mantine/core";
import NavbarMod from "./Navbar";
import { useAppDispatch, useAppSelector } from "../state/hook";
import { getCompPengguna } from "../fitur_state/pengguna";
import { setIndeksData } from "../fitur_state/event";
import { useState } from "react";

function Layout({
  children,
  onNavbarLinkClick,
}: {
  children: React.ReactNode;
  onNavbarLinkClick: (halamanBaru: string) => void;
}) {
  const compPengguna = useAppSelector(getCompPengguna);
  const dispatch = useAppDispatch();
  const [comp, toggleComp] = useState(false);

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

  const set_comp = (e: boolean) => {
    toggleComp(e);
    if (e) {
      dispatch(setIndeksData(1));
    } else {
      dispatch(setIndeksData(0));
    }
  };

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
                    size="xl"
                    color="red"
                    checked={comp}
                    onChange={(event) => set_comp(event.currentTarget.checked)}
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
          },
        })}
      >
        {children}
      </AppShell>
    </>
  );
}

export default Layout;
