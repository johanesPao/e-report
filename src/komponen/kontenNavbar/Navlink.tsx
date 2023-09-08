import React from "react";
import { useState } from "react";
import {
  IconReportSearch,
  IconChartDots,
  IconDeviceDesktopAnalytics,
  IconBinary,
  IconCurrencyDollar,
  IconShoe,
  IconSubtask,
  IconBackhoe,
} from "@tabler/icons-react";
import {
  ThemeIcon,
  UnstyledButton,
  Group,
  Text,
  Collapse,
  Box,
  createStyles,
  rem,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useAppSelector } from "../../state/hook";
import {
  getCompPengguna,
  getDepartemenPengguna,
} from "../../fitur_state/pengguna";
import { getIndeksData } from "../../fitur_state/event";
import {
  IAksesMenu,
  EHalaman,
  IMenuDirectLinks,
  ETampilanIndukMenuHalaman,
  ETampilanLinkHalaman,
  ECompany,
  EDepartemenPengguna,
} from "../../fungsi/basic";

const halaman: IMenuDirectLinks[] = [
  {
    icon: <IconChartDots size="4rem" />,
    color: "green",
    label: ETampilanIndukMenuHalaman.DASHBOARD,
  },
  {
    icon: <IconReportSearch size="4rem" />,
    color: "teal",
    label: ETampilanIndukMenuHalaman.DATA,
    links: [
      {
        icon: <IconBinary size="3rem" />,
        color: "blue",
        label: ETampilanLinkHalaman.PENJUALAN,
        link: EHalaman.PENJUALAN,
      },
      {
        icon: <IconBinary size="3rem" />,
        color: "blue",
        label: ETampilanLinkHalaman.PENERIMAAN_BARANG,
        link: EHalaman.PENERIMAAN_BARANG,
      },
      {
        icon: <IconBinary size="3rem" />,
        color: "blue",
        label: ETampilanLinkHalaman.STOK,
        link: EHalaman.STOK,
      },
      {
        icon: <IconBinary size="3rem" />,
        color: "blue",
        label: ETampilanLinkHalaman.KETERSEDIAAN_STOK,
        link: EHalaman.KETERSEDIAAN_STOK,
      },
    ],
  },
  {
    icon: <IconDeviceDesktopAnalytics size="4rem" />,
    color: "gray",
    label: ETampilanIndukMenuHalaman.DEPARTEMEN,
    subMenu: [
      {
        icon: <IconShoe size="4rem" />,
        color: "blue",
        label: ETampilanIndukMenuHalaman.MERCHANDISING,
        links: [
          {
            icon: <IconDeviceDesktopAnalytics size="4rem" />,
            color: "red",
            label: ETampilanLinkHalaman.BUYING_PROPOSAL,
            link: EHalaman.BUYING_PROPOSAL,
          },
        ],
      },
      {
        icon: <IconSubtask size="4rem" />,
        color: "violet",
        label: ETampilanIndukMenuHalaman.OPERATION,
      },
      {
        icon: <IconCurrencyDollar size="4rem" />,
        color: "green",
        label: ETampilanIndukMenuHalaman.FINANCE_ACCOUNTING,
        links: [
          {
            icon: <IconDeviceDesktopAnalytics size="4rem" />,
            color: "red",
            label: ETampilanLinkHalaman.LABA_RUGI_TOKO,
            link: EHalaman.LABA_RUGI_TOKO,
          },
        ],
      },
      {
        icon: <IconBackhoe size="4rem" />,
        color: "red",
        label: ETampilanIndukMenuHalaman.BUSINESS_DEVELOPMENT,
        links: [
          {
            icon: <IconDeviceDesktopAnalytics size="4rem" />,
            color: "red",
            label: ETampilanLinkHalaman.KELAYAKAN_TOKO_BARU,
            link: EHalaman.KELAYAKAN_TOKO_BARU,
          },
        ],
      },
    ],
  },
  // ...
];

const useStyles = createStyles((theme) => ({
  link: {
    fontWeight: 500,
    display: "block",
    textDecoration: "none",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: theme.spacing.xl,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,
    borderLeft: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.white : theme.black
    }`,
  },
}));

function NavLink({
  icon,
  color,
  label,
  links,
  subMenu,
  onNavlinkClick,
}: IMenuDirectLinks & { onNavlinkClick: (halamanBaru: string) => void }) {
  const { classes, theme } = useStyles();
  const [menuTerbuka, toggleMenuTerbuka] = useState(false);
  const [subMenuTerbuka, toggleSubMenuTerbuka] = useState(
    Array.isArray(subMenu) ? new Array(subMenu.length).fill(false) : []
  );
  const adaLinks = Array.isArray(links);
  const adaSubMenu = Array.isArray(subMenu);
  const compPengguna = useAppSelector(getCompPengguna);
  const deptPengguna = useAppSelector(getDepartemenPengguna);
  const indeksData = useAppSelector(getIndeksData);
  const singleCompanyMode = compPengguna.length === 1;
  const PRI = singleCompanyMode
    ? compPengguna[0] === ECompany.PRI
    : compPengguna.indexOf(ECompany.PRI) === indeksData;
  const administrator = deptPengguna === EDepartemenPengguna.ADMINISTRATOR;

  // DEFINISI STATE AWAL AKSES MENU
  // penting diingat state ini akan dipergunakan pada state disabled dari link,
  // maka state ini akan merupakan reverse boolean yang berarti false
  // berarti memiliki akses ke menu yang dimaksud
  let aksesMenu: Partial<IAksesMenu> = {
    penjualan: false,
    penerimaanBarang: false,
    stok: false,
    ketersediaanStok: false,
    buyingProposal: false,
    labaRugiToko: false,
    kelayakanTokoBaru: false,
  };

  // STATE AKSES MENU BERDASAR COMPANY
  aksesMenu = {
    ...aksesMenu,
    ketersediaanStok: PRI,
    buyingProposal: !PRI,
    kelayakanTokoBaru: !PRI,
  };

  // STATE AKSES MENU BERDASAR DEPARTEMEN
  // administrator skip assignment ini
  !administrator &&
    (aksesMenu = {
      ...aksesMenu,
      labaRugiToko: deptPengguna !== EDepartemenPengguna.FINANCE_ACCOUNTING,
      // lakukan evaluasi hanya jika kelayakanTokoBaru sebelumnya pada
      // company level adalah false. jika kelayakanTokoBaru pada company
      // level adalah true, maka kembalikan true
      // // kelayakanTokoBaru: !aksesMenu.kelayakanTokoBaru
      // // ? // jika bukan BUSINESS_DEVELOPMENT dan bukan FINANCE_ACCOUNTING MANAJER
      // evaluasi true, else false
      // // [
      // // deptPengguna !== EDepartemenPengguna.BUSINESS_DEVELOPMENT,
      // // deptPengguna !== EDepartemenPengguna.FINANCE_ACCOUNTING &&
      // //  peranPengguna !== EPeranPengguna.MANAJER,
      // // ].every((state) => state === true)
      // // : true,
      // setelah dipertimbangkan matang - matang, kelayakanTokoBaru bisa dilihat oleh
      // semua departemen PRI, namun pembuatan proposal toko baru dan persetujuan
      // diatur dalam halaman Kelayakan Toko Baru (lihat kolom_data.tsx)
    });

  const toggleSubMenu = (index: number) => {
    toggleSubMenuTerbuka((stateSebelumnya) => {
      const stateBaru = [...stateSebelumnya];
      stateBaru[index] = !stateBaru[index];
      return stateBaru;
    });
  };

  const navigasiKonten = (konten: string) => {
    onNavlinkClick(konten);
  };

  const cekDisabilitasLink = (
    aksesMenu: Partial<IAksesMenu>,
    link: EHalaman
  ) => {
    // ambil akses menu dengan memanfaatkan indexing value berdasar index
    // Object.keys yang sama dengan subMenuItem.link (EHalaman) pada enumerasi
    // aksesMenu (IAksesMenu)
    return Object.values(aksesMenu)[Object.keys(aksesMenu).indexOf(link)];
  };

  const itemSubMenu = (adaSubMenu ? subMenu : []).map((item, index) => {
    const linkSubMenu = item.links?.map((subMenuItem) => {
      const linkDisabled = cekDisabilitasLink(aksesMenu, subMenuItem.link);
      const warnaTeksDisabled = theme.colors.gray[7];
      const warnaTeks = theme.colors.gray[5];

      return (
        <React.Fragment key={subMenuItem.label}>
          <UnstyledButton sx={{ width: "100%" }}>
            <Text<"a">
              component="a"
              className={classes.link}
              key={subMenuItem.label}
              onClick={
                linkDisabled
                  ? undefined
                  : () => navigasiKonten(subMenuItem.link)
              }
              sx={{
                marginLeft: "80px",
                "&:hover": {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? !linkDisabled
                        ? theme.colors.dark[9]
                        : theme.colors.dark[7]
                      : theme.colors.gray[0],
                  // borderRadius: theme.radius.lg,
                },
                color: linkDisabled ? warnaTeksDisabled : warnaTeks,
              }}
            >
              {subMenuItem.label}
            </Text>
          </UnstyledButton>
        </React.Fragment>
      );
    });

    return [
      <React.Fragment key={item.label}>
        <UnstyledButton
          sx={(theme) => ({
            display: "block",
            width: "100%",
            padding: theme.spacing.md,
            paddingLeft: "40px",
            paddingRight: "0px",
            marginRight: "0px",
            // borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.black,

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[9]
                  : theme.colors.gray[0],
              // borderRadius: theme.radius.lg,
            },
          })}
          onClick={() => toggleSubMenu(index)}
        >
          <Group position="apart" spacing={0} sx={{ width: "90%" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon color={item.color} variant="light">
                {item.icon}
              </ThemeIcon>
              <Box ml="md">{item.label}</Box>
            </Box>
            {(adaSubMenu || adaLinks) && (
              <IconChevronRight
                size="1rem"
                stroke={1.5}
                style={{
                  transform: subMenuTerbuka[index]
                    ? `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`
                    : "none",
                }}
              />
            )}
          </Group>
        </UnstyledButton>
        <Collapse in={subMenuTerbuka[index]}>
          <div>{linkSubMenu}</div>
        </Collapse>
      </React.Fragment>,
    ];
  });

  const itemLink = (adaLinks ? links : []).map((item) => {
    const linkDisabled = cekDisabilitasLink(aksesMenu, item.link);
    const warnaTeks = linkDisabled
      ? theme.colors.gray[7]
      : theme.colors.gray[5];

    return (
      <React.Fragment key={item.label}>
        <UnstyledButton sx={{ width: "100%" }}>
          <Text<"a">
            component="a"
            className={classes.link}
            key={item.label}
            onClick={linkDisabled ? undefined : () => navigasiKonten(item.link)}
            sx={{
              marginLeft: "40px",
              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? !linkDisabled
                      ? theme.colors.dark[9]
                      : theme.colors.dark[7]
                    : theme.colors.gray[0],
                // borderRadius: theme.radius.lg,
              },
              color: warnaTeks,
            }}
          >
            {item.label}
          </Text>
        </UnstyledButton>
      </React.Fragment>
    );
  });

  return (
    <>
      <UnstyledButton
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.md,
          // borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[9]
                : theme.colors.gray[0],
            // borderRadius: theme.radius.lg,
          },
        })}
        onClick={() => toggleMenuTerbuka(!menuTerbuka)}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon color={color} variant="light">
              {icon}
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {(adaSubMenu || adaLinks) && (
            <IconChevronRight
              size="1rem"
              stroke={1.5}
              style={{
                transform: menuTerbuka
                  ? `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`
                  : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {adaSubMenu || adaLinks ? (
        <Collapse in={menuTerbuka}>
          {adaSubMenu ? itemSubMenu : itemLink}
        </Collapse>
      ) : null}
    </>
  );
}

export function NavLinks({
  onLinkClick,
}: {
  onLinkClick: (halamanBaru: string) => void;
}) {
  const links = halaman.map((link) => (
    <NavLink onNavlinkClick={onLinkClick} {...link} key={link.label} />
  ));
  return <div>{links}</div>;
}
