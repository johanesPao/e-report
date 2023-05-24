import { Button, Center, Grid, Space } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconDatabase } from "@tabler/icons-react";

import { useAppDispatch, useAppSelector } from "../../state/hook";
import { getIndeksData, setDrawerTerbuka } from "../../fitur_state/event";

import MultiBrand from "../MultiBrand";
import MultiMC from "../MultiMC";
import {
  getParameterBrand,
  getParameterCat,
  getParameterDiv,
  getParameterGroup,
  getParameterKlasifikasi,
  getParameterLokasi,
  getParameterRegion,
  getParameterSBU,
} from "../../fitur_state/dataParam";
import { useState } from "react";
import { getCompPengguna } from "../../fitur_state/pengguna";
import MultiLokasi from "../MultiLokasi";
import MultiSBU from "../MultiSBU";
import MultiKlasifikasi from "../MultiKlasifikasi";
import MultiRegion from "../MultiRegion";

const InputPenjualan = () => {
  const dispatch = useAppDispatch();
  const compPengguna = useAppSelector(getCompPengguna);
  const parameterBrand = useAppSelector(getParameterBrand);
  const parameterDiv = useAppSelector(getParameterDiv);
  const parameterGroup = useAppSelector(getParameterGroup);
  const parameterCat = useAppSelector(getParameterCat);
  const parameterSBU = useAppSelector(getParameterSBU);
  const parameterLokasi = useAppSelector(getParameterLokasi);
  const parameterKlasifikasi = useAppSelector(getParameterKlasifikasi);
  const parameterRegion = useAppSelector(getParameterRegion);
  const indeksData = useAppSelector(getIndeksData);
  const defaultBrand = parameterBrand[indeksData].map((item) => item.value);
  const defaultDiv = parameterDiv[indeksData].map((item) => item.value);
  const defaultGroup = parameterGroup[indeksData].map((item) => item.value);
  const defaultCat = parameterCat[indeksData].map((item) => item.value);
  const [nilaiBrand, setNilaiBrand] = useState(defaultBrand);
  const [nilaiDiv, setNilaiDiv] = useState(defaultDiv);
  const [nilaiGroup, setNilaiGroup] = useState(defaultGroup);
  const [nilaiCat, setNilaiCat] = useState(defaultCat);
  let nilaiLokasi: string[] = [];
  let setNilaiLokasi:
    | React.Dispatch<React.SetStateAction<string[]>>
    | undefined;
  let nilaiSBU: string[] = [];
  let setNilaiSBU: React.Dispatch<React.SetStateAction<string[]>> | undefined;
  let nilaiKlasifikasi: string[] = [];
  let setNilaiKlasifikasi:
    | React.Dispatch<React.SetStateAction<string[]>>
    | undefined;
  let nilaiRegion: string[] = [];
  let setNilaiRegion:
    | React.Dispatch<React.SetStateAction<string[]>>
    | undefined;
  if (
    (compPengguna.length === 1 && compPengguna[0] === "PRI") ||
    (compPengguna.length === 2 && indeksData === 0)
  ) {
    const defaultLokasi = parameterLokasi.map((item) => item.value);
    [nilaiLokasi, setNilaiLokasi] = useState(defaultLokasi);
    const defaultSBU = parameterSBU.map((item) => item.value);
    [nilaiSBU, setNilaiSBU] = useState(defaultSBU);
  } else {
    const defaultKlasifikasi = parameterKlasifikasi.map((item) => item.value);
    [nilaiKlasifikasi, setNilaiKlasifikasi] = useState(defaultKlasifikasi);
    const defaultRegion = parameterRegion.map((item) => item.value);
    [nilaiRegion, setNilaiRegion] = useState(defaultRegion);
  }

  return (
    <>
      <Grid justify="space-around" mt={12}>
        <Grid.Col span={8}>
          <MultiBrand
            arrayBrandLabel={parameterBrand[indeksData]}
            stateNilai={nilaiBrand}
            setNilai={setNilaiBrand}
          />
          <MultiMC
            arrayDivLabel={parameterDiv[indeksData]}
            stateDiv={nilaiDiv}
            setDiv={setNilaiDiv}
            arrayGroupLabel={parameterGroup[indeksData]}
            stateGroup={nilaiGroup}
            setGroup={setNilaiGroup}
            arrayCatLabel={parameterCat[indeksData]}
            stateCat={nilaiCat}
            setCat={setNilaiCat}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          {/* <Center> */}
          <DatePicker
            size="md"
            type="range"
            allowSingleDateInRange
            numberOfColumns={2}
            pr={0}
          />
          {/* </Center> */}
        </Grid.Col>
        {(compPengguna.length === 1 && compPengguna.includes("PRI")) ||
        (compPengguna.length === 2 && indeksData === 0) ? (
          <>
            <Grid.Col span={12}>
              <MultiSBU
                arraySBULabel={parameterSBU}
                stateNilai={nilaiSBU}
                setNilai={
                  setNilaiSBU as React.Dispatch<React.SetStateAction<string[]>>
                }
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <MultiLokasi
                arrayLokasiLabel={parameterLokasi}
                stateNilai={nilaiLokasi}
                setNilai={
                  setNilaiLokasi as React.Dispatch<
                    React.SetStateAction<string[]>
                  >
                }
              />
            </Grid.Col>
          </>
        ) : null}
        {(compPengguna.length === 1 && compPengguna.includes("PNT")) ||
        (compPengguna.length === 2 && indeksData === 1) ? (
          <>
            <Grid.Col span={12}>
              <MultiKlasifikasi
                arrayKlasifikasiLabel={parameterKlasifikasi}
                stateNilai={nilaiKlasifikasi}
                setNilai={
                  setNilaiKlasifikasi as React.Dispatch<
                    React.SetStateAction<string[]>
                  >
                }
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <MultiRegion
                arrayRegionLabel={parameterRegion}
                stateNilai={nilaiRegion}
                setNilai={
                  setNilaiRegion as React.Dispatch<
                    React.SetStateAction<string[]>
                  >
                }
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
            <Button color="teal" leftIcon={<IconDatabase size={24} />}>
              Tarik Data Penjualan
            </Button>
          </Grid.Col>
        </Center>
      </Grid>
    </>
  );
};

export default InputPenjualan;
