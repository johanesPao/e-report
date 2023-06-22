import { useState } from "react";
import {
  getBrandInput,
  getCatInput,
  getDivInput,
  getGrpInput,
  getLokasiInput,
  getParameterBc,
  getParameterBrand,
  getParameterCat,
  getParameterDiv,
  getParameterGroup,
  getParameterLokasi,
} from "../../fitur_state/dataParam";
import { getIndeksData, setDrawerTerbuka } from "../../fitur_state/event";
import { getCompPengguna } from "../../fitur_state/pengguna";
import {
  StateInputDrawerPenerimaanBarang,
  StatePenerimaanBarang,
  prosesInput,
} from "../../fungsi/halaman/penerimaanBarang";
import { useAppDispatch, useAppSelector } from "../../state/hook";
import { Button, Center, Grid, Space } from "@mantine/core";
import MultiBrand from "../MultiBrand";
import MultiMC from "../MultiMC";
import { DatePicker } from "@mantine/dates";
import MultiLokasi from "../MultiLokasi";
import { IconDatabase } from "@tabler/icons-react";

const InputPenerimaanBarang = ({
  setProps,
}: {
  setProps: React.Dispatch<React.SetStateAction<StatePenerimaanBarang>>;
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

  const initialStateInputDrawerPenerimaanBarang: StateInputDrawerPenerimaanBarang =
    {
      rangeTanggal: [null, null],
      nilaiBrand: brandInput[indeksData],
      nilaiDiv: divInput[indeksData],
      nilaiGrp: grpInput[indeksData],
      nilaiCat: catInput[indeksData],
      nilaiLokasi: lokasiInput[indeksData],
    };

  const [stateInputPenerimaanBarang, setStateInputPenerimaanBarang] = useState(
    initialStateInputDrawerPenerimaanBarang
  );

  return (
    <>
      <Grid justify="space-around" mt={12}>
        <Grid.Col span={8}>
          <MultiBrand
            arrayBrandLabel={parameterBrand[indeksData]}
            props={stateInputPenerimaanBarang}
            setProps={setStateInputPenerimaanBarang}
          />
          <MultiMC
            arrayDivLabel={parameterDiv[indeksData]}
            arrayGroupLabel={parameterGroup[indeksData]}
            arrayCatLabel={parameterCat[indeksData]}
            props={stateInputPenerimaanBarang}
            setProps={setStateInputPenerimaanBarang}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          {/* <Center> */}
          <DatePicker
            size="md"
            type="range"
            value={stateInputPenerimaanBarang.rangeTanggal}
            onChange={(nilai) =>
              setStateInputPenerimaanBarang((stateSebelumnya) => ({
                ...stateSebelumnya,
                rangeTanggal: nilai,
              }))
            }
            allowSingleDateInRange
            numberOfColumns={2}
            pr={0}
          />
          {/* </Center> */}
        </Grid.Col>

        <Grid.Col span={12}>
          <MultiLokasi
            arrayLokasiLabel={parameterLokasi[indeksData]}
            props={stateInputPenerimaanBarang}
            setProps={setStateInputPenerimaanBarang}
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
              onClick={() =>
                prosesInput(dispatch, stateInputPenerimaanBarang, setProps)
              }
            >
              Tarik Data Penerimaan Barang
            </Button>
          </Grid.Col>
        </Center>
      </Grid>
    </>
  );
};

export default InputPenerimaanBarang;
