import React from "react";
import { useState } from "react";
import {
  IconReportSearch,
  IconChartDots,
  IconDeviceDesktopAnalytics,
  IconBinary,
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

interface NavLinkProp {
  icon: React.ReactNode;
  color: string;
  label: string;
  links?: {
    icon: React.ReactNode;
    color: string;
    label: string;
    link: string;
  }[];
  subMenu?: {
    icon: React.ReactNode;
    color: string;
    label: string;
    links?: {
      icon: React.ReactNode;
      color: string;
      label: string;
      link: string;
    }[];
  }[];
}

const halaman: NavLinkProp[] = [
  {
    icon: <IconChartDots size="4rem" />,
    color: "green",
    label: "Dashboard",
  },
  {
    icon: <IconReportSearch size="4rem" />,
    color: "teal",
    label: "Data",
    links: [
      {
        icon: <IconBinary size="3rem" />,
        color: "blue",
        label: "Penjualan",
        link: "penjualan",
      },
      {
        icon: <IconBinary size="3rem" />,
        color: "blue",
        label: "Penerimaan Barang",
        link: "penerimaanBarang",
      },
      {
        icon: <IconBinary size="3rem" />,
        color: "blue",
        label: "Stok",
        link: "stok",
      },
      {
        icon: <IconBinary size="3rem" />,
        color: "blue",
        label: "Ketersediaan Stok",
        link: "ketersediaanStok",
      },
    ],
  },
  {
    icon: <IconDeviceDesktopAnalytics size="4rem" />,
    color: "gray",
    label: "Departemen",
    subMenu: [
      {
        icon: <IconDeviceDesktopAnalytics size="4rem" />,
        color: "red",
        label: "Merchandising",
        links: [
          {
            icon: <IconDeviceDesktopAnalytics size="4rem" />,
            color: "red",
            label: "Buying Proposal",
            link: "buyingProposal",
          },
        ],
      },
      {
        icon: <IconDeviceDesktopAnalytics size="4rem" />,
        color: "red",
        label: "Operation",
      },
      {
        icon: <IconDeviceDesktopAnalytics size="4rem" />,
        color: "red",
        label: "Finance & Accounting",
        links: [
          {
            icon: <IconDeviceDesktopAnalytics size="4rem" />,
            color: "red",
            label: "Store Profit & Loss",
            link: "labaRugiToko",
          },
        ],
      },
      {
        icon: <IconDeviceDesktopAnalytics size="4rem" />,
        color: "red",
        label: "Business Development",
        links: [
          {
            icon: <IconDeviceDesktopAnalytics size="4rem" />,
            color: "red",
            label: "New Store Feasibility Study",
            link: "kelayakanTokoBaru",
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
}: NavLinkProp & { onNavlinkClick: (halamanBaru: string) => void }) {
  const { classes, theme } = useStyles();
  const [menuTerbuka, toggleMenuTerbuka] = useState(false);
  const [subMenuTerbuka, toggleSubMenuTerbuka] = useState(
    Array.isArray(subMenu) ? new Array(subMenu.length).fill(false) : []
  );
  const adaLinks = Array.isArray(links);
  const adaSubMenu = Array.isArray(subMenu);

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

  const itemSubMenu = (adaSubMenu ? subMenu : []).map((item, index) => {
    const linkSubMenu = item.links?.map((subMenuItem) => {
      return (
        <React.Fragment key={subMenuItem.label}>
          <UnstyledButton sx={{ width: "100%" }}>
            <Text<"a">
              component="a"
              className={classes.link}
              key={subMenuItem.label}
              onClick={() => navigasiKonten(subMenuItem.link)}
              sx={{
                marginLeft: "80px",
                "&:hover": {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[9]
                      : theme.colors.gray[0],
                  // borderRadius: theme.radius.lg,
                },
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
    return (
      <React.Fragment key={item.label}>
        <UnstyledButton sx={{ width: "100%" }}>
          <Text<"a">
            component="a"
            className={classes.link}
            // href={item.link}
            key={item.label}
            onClick={() => navigasiKonten(item.link)}
            sx={{
              marginLeft: "40px",
              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[9]
                    : theme.colors.gray[0],
                // borderRadius: theme.radius.lg,
              },
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

// function LinksGroup({icon, color, label, links}:)

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
