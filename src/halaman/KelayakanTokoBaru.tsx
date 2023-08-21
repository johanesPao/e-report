import { useMemo } from "react";
import { DataTabelKelayakanTokoBaru } from "../fungsi/basic";
import { Tabel } from "../komponen/Tabel";
import { MRT_ColumnDef } from "mantine-react-table";
import { definisiKolomKelayakanTokoBaru } from "../fungsi/kolom_data";
import { StateKelayakanTokoBaru } from "../fungsi/halaman/kelayakanTokoBaru";
import { Center, Title } from "@mantine/core";
import { PopUp } from "../komponen/PopUp";

const KelayakanTokoBaru = ({
  props,
  setProps,
}: {
  props: StateKelayakanTokoBaru;
  setProps: React.Dispatch<React.SetStateAction<StateKelayakanTokoBaru>>;
}) => {
  const definisiKolom = useMemo<MRT_ColumnDef<DataTabelKelayakanTokoBaru>[]>(
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
            setProps={setProps}
          />
        )}
      </div>
      <PopUp props={props} setProps={setProps} />
    </>
  );
};

export default KelayakanTokoBaru;
