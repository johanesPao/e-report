import { Button, Grid, Space } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconDatabase } from "@tabler/icons-react";

import { useAppDispatch, useAppSelector } from "../../state/hook";
import { getIndeksData, setDrawerTerbuka } from "../../fitur_state/event";

import MultiBrand from "../MultiBrand";
import { getParameterBrand } from "../../fitur_state/dataParam";
import { useState } from "react";

const InputPenjualan = () => {
  const dispatch = useAppDispatch();
  const parameterBrand = useAppSelector(getParameterBrand);
  const indeksData = useAppSelector(getIndeksData);
  const defaultMultiBrand = parameterBrand[indeksData].map(
    (item) => item.value
  );
  const [valueMultiBrand, setValueMultiBrand] = useState(defaultMultiBrand);

  return (
    <>
      <Grid justify="space-around" mt={12}>
        <Grid.Col span={12}>
          {/* <Center> */}
          <DatePicker
            size="sm"
            type="range"
            allowSingleDateInRange
            numberOfColumns={2}
          />
          {/* </Center> */}
        </Grid.Col>
        <Grid.Col span={12}>
          <MultiBrand
            arrayBrandLabel={parameterBrand[indeksData]}
            stateNilai={valueMultiBrand}
            setNilai={setValueMultiBrand}
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
