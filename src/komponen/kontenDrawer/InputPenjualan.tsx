import { useState } from "react";
import { Button, Center, Grid, Space } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconDatabase } from "@tabler/icons-react";

import { useAppDispatch, useAppSelector } from "../../state/hook";
import { getIndeksData, setDrawerTerbuka } from "../../fitur_state/event";

import MultiBrand from "../MultiBrand";
import MultiMC from "../MultiMC";
import {
  getBrandInput,
  getCatInput,
  getDivInput,
  getGrpInput,
  getKlasifikasiInput,
  getLokasiInput,
  getParameterBc,
  getParameterBrand,
  getParameterCat,
  getParameterDiv,
  getParameterGroup,
  getParameterKlasifikasi,
  getParameterLokasi,
  getParameterRegion,
  getParameterSBU,
  getRegionInput,
  getSBUInput,
} from "../../fitur_state/dataParam";
import { getCompPengguna } from "../../fitur_state/pengguna";
import MultiLokasi from "../MultiLokasi";
import MultiSBU from "../MultiSBU";
import MultiKlasifikasi from "../MultiKlasifikasi";
import MultiRegion from "../MultiRegion";
import {
  StateInputDrawerPenjualan,
  StatePenjualan,
} from "../../fungsi/halaman/penjualan";
import { prosesInput } from "../../fungsi/halaman/penjualan";

const InputPenjualan = ({
  setProps,
}: {
  setProps: React.Dispatch<React.SetStateAction<StatePenjualan>>;
}) => {
  const dispatch = useAppDispatch();
  const compPengguna = useAppSelector(getCompPengguna);
  const parameterBc = useAppSelector(getParameterBc);
  const parameterBrand = useAppSelector(getParameterBrand);
  const parameterDiv = useAppSelector(getParameterDiv);
  const parameterGroup = useAppSelector(getParameterGroup);
  const parameterCat = useAppSelector(getParameterCat);
  const parameterSBU = useAppSelector(getParameterSBU);
  const parameterLokasi = useAppSelector(getParameterLokasi);
  const parameterKlasifikasi = useAppSelector(getParameterKlasifikasi);
  const parameterRegion = useAppSelector(getParameterRegion);
  const brandInput = useAppSelector(getBrandInput);
  const indeksData = useAppSelector(getIndeksData);
  const divInput = useAppSelector(getDivInput);
  const grpInput = useAppSelector(getGrpInput);
  const catInput = useAppSelector(getCatInput);
  const sbuInput = useAppSelector(getSBUInput);
  const lokasiInput = useAppSelector(getLokasiInput);
  const klasifikasiInput = useAppSelector(getKlasifikasiInput);
  const regionInput = useAppSelector(getRegionInput);

  const intialStateInputDrawerPenjualan: StateInputDrawerPenjualan = {
    rangeTanggal: [null, null],
    nilaiBrand: brandInput[indeksData],
    nilaiDiv: divInput[indeksData],
    nilaiGrp: grpInput[indeksData],
    nilaiCat: catInput[indeksData],
    nilaiSBU: sbuInput,
    nilaiLokasi: lokasiInput[indeksData],
    nilaiKlasifikasi: klasifikasiInput,
    nilaiRegion: regionInput,
  };

  const [stateInputPenjualan, setStateInputPenjualan] = useState(
    intialStateInputDrawerPenjualan
  );

  return (
    <>
      <Grid justify="space-around" mt={12}>
        <Grid.Col span={8}>
          <MultiBrand
            arrayBrandLabel={parameterBrand[indeksData]}
            props={stateInputPenjualan}
            setProps={setStateInputPenjualan}
          />
          <MultiMC
            arrayDivLabel={parameterDiv[indeksData]}
            arrayGroupLabel={parameterGroup[indeksData]}
            arrayCatLabel={parameterCat[indeksData]}
            props={stateInputPenjualan}
            setProps={setStateInputPenjualan}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          {/* <Center> */}
          <DatePicker
            size="md"
            type="range"
            value={stateInputPenjualan.rangeTanggal}
            onChange={(nilai) =>
              setStateInputPenjualan((stateSebelumnya: any) => ({
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
        {(compPengguna.length === 1 &&
          compPengguna.includes(parameterBc.comp.pri)) ||
        (compPengguna.length === 2 && indeksData === 0) ? (
          <>
            <Grid.Col span={12}>
              <MultiSBU
                arraySBULabel={parameterSBU}
                props={stateInputPenjualan}
                setProps={setStateInputPenjualan}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <MultiLokasi
                arrayLokasiLabel={parameterLokasi[indeksData]}
                props={stateInputPenjualan}
                setProps={setStateInputPenjualan}
              />
            </Grid.Col>
          </>
        ) : null}
        {(compPengguna.length === 1 &&
          compPengguna.includes(parameterBc.comp.pnt)) ||
        (compPengguna.length === 2 && indeksData === 1) ? (
          <>
            <Grid.Col span={12}>
              <MultiKlasifikasi
                arrayKlasifikasiLabel={parameterKlasifikasi}
                props={stateInputPenjualan}
                setProps={setStateInputPenjualan}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <MultiRegion
                arrayRegionLabel={parameterRegion}
                props={stateInputPenjualan}
                setProps={setStateInputPenjualan}
              />
            </Grid.Col>
          </>
        ) : null}
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
                prosesInput(
                  dispatch,
                  stateInputPenjualan,
                  compPengguna,
                  indeksData,
                  parameterBc,
                  setProps
                )
              }
            >
              Tarik Data Penjualan
            </Button>
          </Grid.Col>
        </Center>
      </Grid>
    </>
  );
};

export default InputPenjualan;
