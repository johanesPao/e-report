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
import { getIndeksData, setIndeksData } from "../fitur_state/event";
import { useState } from "react";
import { getParameterBrand } from "../fitur_state/dataParam";

function Layout({
  children,
  onNavbarLinkClick,
}: {
  children: React.ReactNode;
  onNavbarLinkClick: (halamanBaru: string) => void;
}) {
  const compPengguna = useAppSelector(getCompPengguna);
  const parameterBrand = useAppSelector(getParameterBrand);
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
      console.log(parameterBrand[1]);
      dispatch(setIndeksData(1));
    } else {
      console.log(parameterBrand[0]);
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
