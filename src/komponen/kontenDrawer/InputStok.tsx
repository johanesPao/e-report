import { useState } from "react";
import {
  getBrandInput,
  getCatInput,
  getDivInput,
  getGrpInput,
  getLokasiInput,
  getParameterBrand,
  getParameterCat,
  getParameterDiv,
  getParameterGroup,
  getParameterLokasi,
} from "../../fitur_state/dataParam";
import { getIndeksData, setDrawerTerbuka } from "../../fitur_state/event";
import {
  StateInputDrawerStok,
  StateStok,
  prosesInput,
} from "../../fungsi/halaman/stok";
import { useAppDispatch, useAppSelector } from "../../state/hook";
import { Button, Center, Grid, Space } from "@mantine/core";
import MultiBrand from "../MultiBrand";
import MultiMC from "../MultiMC";
import { DatePicker } from "@mantine/dates";
import MultiLokasi from "../MultiLokasi";
import { IconDatabase } from "@tabler/icons-react";

const InputStok = ({
  setProps,
}: {
  setProps: React.Dispatch<React.SetStateAction<StateStok>>;
}) => {
  const dispatch = useAppDispatch();
  const parameterBrand = useAppSelector(getParameterBrand);
  const parameterDiv = useAppSelector(getParameterDiv);
  const parameterGroup = useAppSelector(getParameterGroup);
  const parameterCat = useAppSelector(getParameterCat);
  const parameterLokasi = useAppSelector(getParameterLokasi);
  const brandInput = useAppSelector(getBrandInput);
  const indeksData = useAppSelector(getIndeksData);
  const divInput = useAppSelector(getDivInput);
  const grpInput = useAppSelector(getGrpInput);
  const catInput = useAppSelector(getCatInput);
  const lokasiInput = useAppSelector(getLokasiInput);
  const tanggalHariIni = new Date();

  const initialStateInputDrawerStok: StateInputDrawerStok = {
    tglStok: tanggalHariIni,
    nilaiBrand: brandInput[indeksData],
    nilaiDiv: divInput[indeksData],
    nilaiGrp: grpInput[indeksData],
    nilaiCat: catInput[indeksData],
    nilaiLokasi: lokasiInput[indeksData],
  };

  const [stateInputStok, setStateInputStok] = useState(
    initialStateInputDrawerStok
  );

  return (
    <>
      <Grid justify="space-around" mt={12}>
        <Grid.Col span={8}>
          <MultiBrand
            arrayBrandLabel={parameterBrand[indeksData]}
            props={stateInputStok}
            setProps={setStateInputStok}
          />
          <MultiMC
            arrayDivLabel={parameterDiv[indeksData]}
            arrayGroupLabel={parameterGroup[indeksData]}
            arrayCatLabel={parameterCat[indeksData]}
            props={stateInputStok}
            setProps={setStateInputStok}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <DatePicker
            size="md"
            // defaultValue={new Date()}
            value={stateInputStok.tglStok}
            onChange={(nilai) =>
              setStateInputStok((stateSebelumnya) => ({
                ...stateSebelumnya,
                tglStok: nilai,
              }))
            }
            numberOfColumns={2}
            pr={0}
            maxDate={tanggalHariIni}
            minDate={new Date(2022, 11, 1)}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <MultiLokasi
            arrayLokasiLabel={parameterLokasi[indeksData]}
            props={stateInputStok}
            setProps={setStateInputStok}
          />
        </Grid.Col>
        <Grid.Col span="auto">
          <Space />
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
              onClick={() => prosesInput(dispatch, stateInputStok, setProps)}
            >
              Tarik Data Stok
            </Button>
          </Grid.Col>
        </Center>
      </Grid>
    </>
  );
};

export default InputStok;
