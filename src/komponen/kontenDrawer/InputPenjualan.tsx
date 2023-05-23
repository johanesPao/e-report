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
} from "../../fitur_state/dataParam";
import { useState } from "react";

const InputPenjualan = () => {
  const dispatch = useAppDispatch();
  const parameterBrand = useAppSelector(getParameterBrand);
  const parameterDiv = useAppSelector(getParameterDiv);
  const parameterGroup = useAppSelector(getParameterGroup);
  const parameterCat = useAppSelector(getParameterCat);
  const indeksData = useAppSelector(getIndeksData);
  const defaultBrand = parameterBrand[indeksData].map((item) => item.value);
  const defaultDiv = parameterDiv[indeksData].map((item) => item.value);
  const defaultGroup = parameterGroup[indeksData].map((item) => item.value);
  const defaultCat = parameterCat[indeksData].map((item) => item.value);
  const [nilaiBrand, setNilaiBrand] = useState(defaultBrand);
  const [nilaiDiv, setNilaiDiv] = useState(defaultDiv);
  const [nilaiGroup, setNilaiGroup] = useState(defaultGroup);
  const [nilaiCat, setNilaiCat] = useState(defaultCat);

  return (
    <>
      <Grid justify="space-around" mt={12}>
        <Grid.Col span={12}>
          <Center>
            <DatePicker
              size="sm"
              type="range"
              allowSingleDateInRange
              numberOfColumns={2}
            />
          </Center>
        </Grid.Col>
        <Grid.Col span={12}>
          <MultiBrand
            arrayBrandLabel={parameterBrand[indeksData]}
            stateNilai={nilaiBrand}
            setNilai={setNilaiBrand}
          />
        </Grid.Col>
        <Grid.Col span={12}>
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
        <Grid.Col span="auto">
          <Space />
        </Grid.Col>
        <Grid.Col span="content">
          <Button color="red" onClick={() => dispatch(setDrawerTerbuka(false))}>
            Tutup
          </Button>
        </Grid.Col>
        <Grid.Col span="content">
          <Button color="teal" leftIcon={<IconDatabase size={24} />}>
            Tarik Data Penjualan
          </Button>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default InputPenjualan;
