import React, { useMemo } from "react";
import { TDataTabelKelayakanTokoBaru } from "../fungsi/basic";
import { Tabel } from "../komponen/Tabel";
import { MRT_ColumnDef } from "mantine-react-table";
import { definisiKolomKelayakanTokoBaru } from "../fungsi/kolom_data";
import { StateKelayakanTokoBaru } from "../fungsi/halaman/kelayakanTokoBaru";
import { Center, Title } from "@mantine/core";
import { PopUp, StatePopUp } from "../komponen/PopUp";
import { useAppSelector } from "../state/hook";
import { getDataTabelKelayakanTokoBaru } from "../fitur_state/dataBank";

const KelayakanTokoBaru = ({
  props,
  popUp,
  setPopUp,
}: {
  props: StateKelayakanTokoBaru;
  popUp: StatePopUp;
  setPopUp: React.Dispatch<React.SetStateAction<StatePopUp>>;
}) => {
  const data = useAppSelector(getDataTabelKelayakanTokoBaru);
  const definisiKolom = useMemo<MRT_ColumnDef<TDataTabelKelayakanTokoBaru>[]>(
    () => definisiKolomKelayakanTokoBaru(),
    []
  );

  return (
    <>
      <div style={{ padding: "25px" }}>
        {props.tampilanTabel.length === 0 &&
        !props.muatTabelKelayakanTokoBaru ? (
          <Center sx={{ height: "100%", opacity: 0.5 }}>
            <Title>Tidak ada data yang dimuat</Title>
          </Center>
        ) : (
          <Tabel
            arrKolom={definisiKolom}
            arrData={props.tampilanTabel}
            memuatData={props.muatTabelKelayakanTokoBaru}
            setPopUp={setPopUp}
          />
        )}
      </div>
      <PopUp data={data} props={props} popUp={popUp} setPopUp={setPopUp} />
    </>
  );
};

export default KelayakanTokoBaru;
