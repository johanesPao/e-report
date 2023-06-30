import { Button, Center, Grid } from "@mantine/core";
import {
  StateInputDrawerLabaRugiToko,
  StateLabaRugiToko,
  prosesInput,
} from "../../fungsi/halaman/labaRugiToko";
import { useAppDispatch } from "../../state/hook";
import { DatePicker } from "@mantine/dates";
import { useState } from "react";
import { setDrawerTerbuka } from "../../fitur_state/event";
import { IconDatabase } from "@tabler/icons-react";

const InputLabaRugiToko = ({
  setProps,
}: {
  setProps: React.Dispatch<React.SetStateAction<StateLabaRugiToko>>;
}) => {
  const dispatch = useAppDispatch();
  const tanggalHariIni = new Date();
  const tanggalPertamaBulanIni = new Date(
    tanggalHariIni.getFullYear(),
    tanggalHariIni.getMonth(),
    1
  );

  const initialStateInputDrawerLabaRugiToko: StateInputDrawerLabaRugiToko = {
    rangeTanggal: [tanggalPertamaBulanIni, tanggalHariIni],
  };

  const [stateInputLabaRugiToko, setStateInputLabaRugiToko] = useState(
    initialStateInputDrawerLabaRugiToko
  );

  return (
    <>
      <Grid justify="space-around" mt={12}>
        <Grid.Col span={12}>
          <Center>
            <DatePicker
              size="md"
              type="range"
              value={stateInputLabaRugiToko.rangeTanggal}
              onChange={(nilai) =>
                setStateInputLabaRugiToko((stateSebelumnya: any) => ({
                  ...stateSebelumnya,
                  rangeTanggal: nilai,
                }))
              }
              allowSingleDateInRange
              numberOfColumns={2}
              pr={0}
              maxDate={tanggalHariIni}
              minDate={new Date(2022, 11, 1)}
            />
          </Center>
        </Grid.Col>
        <Center>
          <Grid.Col span="content">
            <Button
              color="red"
              onClick={() => dispatch(setDrawerTerbuka(false))}
            >
              Tutup
            </Button>
          </Grid.Col>
          <Grid.Col span="content">
            <Button
              color="teal"
              leftIcon={<IconDatabase size={24} />}
              onClick={() =>
                prosesInput(dispatch, stateInputLabaRugiToko, setProps)
              }
            >
              Tarik Data Laba Rugi Toko
            </Button>
          </Grid.Col>
        </Center>
      </Grid>
    </>
  );
};

export default InputLabaRugiToko;
