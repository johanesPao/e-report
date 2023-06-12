import { useMemo } from "react";
import {
  MRT_ColumnDef,
  MantineReactTable,
  type MantineReactTableProps,
} from "mantine-react-table";

interface Props {
  arrKolom: MRT_ColumnDef<any>[];
  arrData: any[];
  onlyProps?: Set<keyof MantineReactTableProps>;
}

export const Tabel = ({ arrKolom, arrData, onlyProps }: Props) => {
  const columns = useMemo(() => arrKolom, []);
  const data = useMemo(() => arrData, []);

  return (
    <MantineReactTable
      columns={columns}
      data={data}
      enableColumnFilterModes
      enableColumnOrdering
      enablePinning
      enableGrouping
      enableRowActions
      enableRowSelection
      initialState={{
        showColumnFilters: true,
        density: "xs",
      }}
      positionToolbarAlertBanner="bottom"
    />
  );
};
