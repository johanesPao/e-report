import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  Box,
  useMantineTheme,
  rem,
} from "@mantine/core";

import AvaPengguna from "../aset/gambar/user.png";

import { useAppSelector } from "../state/hook";
import { getNamaPengguna, getEmailPengguna } from "../fitur_state/pengguna";

export function NavigasiPengguna() {
  const theme = useMantineTheme();
  const namaPengguna = useAppSelector(getNamaPengguna);
  const emailPengguna = useAppSelector(getEmailPengguna);

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `${rem(1)} solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <UnstyledButton
        sx={{
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        }}
      >
        <Group>
          <Avatar src={AvaPengguna} radius="xl" />
          <Box sx={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {namaPengguna}
            </Text>
            <Text color="dimmed" size="xs">
              {emailPengguna}
            </Text>
          </Box>
        </Group>
      </UnstyledButton>
    </Box>
  );
}
