import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import "simplebar-react/dist/simplebar.min.css";
import { useAppSelector } from "../state/hook";
import { getHalaman } from "../fitur_state/event";
import { TableProps, buatPropsTabel } from "../fungsi/kolom_data";
import { StatePopUp } from "./PopUp";
import { getIdPengguna } from "../fitur_state/pengguna";

interface Props<T extends Record<string, any>> {
  arrKolom: MRT_ColumnDef<T>[];
  arrData: T[];
  memuatData: boolean;
  setPopUp?: React.Dispatch<React.SetStateAction<StatePopUp>>;
}

export const Tabel = <T extends Record<string, any>>({
  arrKolom,
  arrData,
  memuatData,
  setPopUp,
}: Props<T>) => {
  const halaman = useAppSelector(getHalaman);
  const idPengguna = useAppSelector(getIdPengguna);
  const props: TableProps = buatPropsTabel(
    halaman,
    idPengguna,
    arrData,
    memuatData,
    setPopUp
  );

  return (
    <div style={{ height: "100%" }}>
      {
        //@ts-ignore
        <MantineReactTable<T> columns={arrKolom} data={arrData} {...props} />
      }
    </div>
  );
};
