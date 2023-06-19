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
import { PropsPenjualan } from "../Konten";
import { prosesInput } from "../../fungsi/halaman/penjualan";

interface InputPenjualanProps {
  setPenjualan: React.Dispatch<React.SetStateAction<PropsPenjualan>>;
  setMuatDataPenjualan: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputPenjualan = ({
  setPenjualan,
  setMuatDataPenjualan,
}: InputPenjualanProps) => {
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

  const [rangeTanggal, setRangeTanggal] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [nilaiBrand, setNilaiInputBrand] = useState(brandInput[indeksData]);
  const [nilaiDiv, setNilaiDiv] = useState(divInput[indeksData]);
  const [nilaiGroup, setNilaiGroup] = useState(grpInput[indeksData]);
  const [nilaiCat, setNilaiCat] = useState(catInput[indeksData]);
  const [nilaiLokasi, setNilaiLokasi] = useState(lokasiInput);
  const [nilaiSBU, setNilaiSBU] = useState(sbuInput);
  const [nilaiKlasifikasi, setNilaiKlasifikasi] = useState(klasifikasiInput);
  const [nilaiRegion, setNilaiRegion] = useState(regionInput);

  return (
    <>
      <Grid justify="space-around" mt={12}>
        <Grid.Col span={8}>
          <MultiBrand
            arrayBrandLabel={parameterBrand[indeksData]}
            stateNilai={nilaiBrand}
            setNilai={setNilaiInputBrand}
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
            value={rangeTanggal}
            onChange={setRangeTanggal}
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
        {(compPengguna.length === 1 &&
          compPengguna.includes(parameterBc.comp.pnt)) ||
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
            <Button
              color="teal"
              leftIcon={<IconDatabase size={24} />}
              onClick={() =>
                prosesInput(
                  dispatch,
                  rangeTanggal,
                  setPenjualan,
                  nilaiBrand,
                  nilaiDiv,
                  nilaiGroup,
                  nilaiCat,
                  nilaiSBU,
                  nilaiLokasi,
                  nilaiKlasifikasi,
                  nilaiRegion,
                  compPengguna,
                  indeksData,
                  parameterBc,
                  setMuatDataPenjualan
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
