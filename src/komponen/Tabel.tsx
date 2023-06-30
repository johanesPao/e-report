import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import "simplebar-react/dist/simplebar.min.css";
import { useAppSelector } from "../state/hook";
import { getHalaman } from "../fitur_state/event";
import { TableProps, buatPropsTabel } from "../fungsi/kolom_data";

interface Props<T extends Record<string, any>> {
  arrKolom: MRT_ColumnDef<T>[];
  arrData: T[];
  memuatData: boolean;
}

export const Tabel = <T extends Record<string, any>>({
  arrKolom,
  arrData,
  memuatData,
}: Props<T>) => {
  const halaman = useAppSelector(getHalaman);
  const props: TableProps = buatPropsTabel(halaman, arrData, memuatData);

  return (
    <div style={{ height: "100%" }}>
      <MantineReactTable<T> columns={arrKolom} data={arrData} {...props} />
    </div>
  );
};
