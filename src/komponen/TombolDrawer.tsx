import { Button } from "@mantine/core";
import { setDrawerTerbuka } from "../fitur_state/event";

interface TombolDrawerProps {
  label: string;
  nonAktif: boolean;
  aksiRedux: any;
  warna: string;
}

export const TombolDrawer = ({
  label,
  nonAktif,
  aksiRedux,
  warna,
}: TombolDrawerProps) => {
  return (
    <Button
      fullWidth
      disabled={!nonAktif}
      onClick={() => aksiRedux(setDrawerTerbuka(true))}
      radius={0}
      size="sm"
      color={warna}
      sx={{ ":active": { transform: "scale(1)" } }}
    >
      {label}
    </Button>
  );
};
