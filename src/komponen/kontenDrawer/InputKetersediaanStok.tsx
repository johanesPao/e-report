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
  StateInputDrawerKetersediaanStok,
  StateKetersediaanStok,
  prosesInput,
} from "../../fungsi/halaman/ketersediaanStok";
import { useAppDispatch, useAppSelector } from "../../state/hook";
import { Button, Center, Grid, Space } from "@mantine/core";
import MultiBrand from "../MultiBrand";
import MultiMC from "../MultiMC";
import MultiLokasi from "../MultiLokasi";
import { IconDatabase } from "@tabler/icons-react";

const InputKetersediaanStok = ({
  setProps,
}: {
  setProps: React.Dispatch<React.SetStateAction<StateKetersediaanStok>>;
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

  const initialStateInputDrawerKetersediaanStok: StateInputDrawerKetersediaanStok =
    {
      nilaiBrand: brandInput[indeksData],
      nilaiDiv: divInput[indeksData],
      nilaiGrp: grpInput[indeksData],
      nilaiCat: catInput[indeksData],
      nilaiLokasi: lokasiInput[indeksData],
    };

  const [stateInputKetersediaanStok, setStateInputKetersediaanStok] = useState(
    initialStateInputDrawerKetersediaanStok
  );

  return (
    <>
      <Grid justify="space-around" mt={12}>
        <Grid.Col span={12}>
          <MultiBrand
            arrayBrandLabel={parameterBrand[indeksData]}
            props={stateInputKetersediaanStok}
            setProps={setStateInputKetersediaanStok}
          />
          <MultiMC
            arrayDivLabel={parameterDiv[indeksData]}
            arrayGroupLabel={parameterGroup[indeksData]}
            arrayCatLabel={parameterCat[indeksData]}
            props={stateInputKetersediaanStok}
            setProps={setStateInputKetersediaanStok}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <MultiLokasi
            arrayLokasiLabel={parameterLokasi[indeksData]}
            props={stateInputKetersediaanStok}
            setProps={setStateInputKetersediaanStok}
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
                prosesInput(dispatch, stateInputKetersediaanStok, setProps)
              }
            >
              Tarik Data Ketersediaan Stok
            </Button>
          </Grid.Col>
        </Center>
      </Grid>
    </>
  );
};

export default InputKetersediaanStok;
