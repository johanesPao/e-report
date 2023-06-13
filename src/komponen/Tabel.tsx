import { Center, Text } from "@mantine/core";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";

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
  return (
    <div style={{ height: "100%" }}>
      <MantineReactTable<T>
        columns={arrKolom}
        data={arrData}
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
        renderEmptyRowsFallback={() => (
          <Center>
            <Text></Text>
          </Center>
        )}
        state={{ isLoading: memuatData }}
      />
    </div>
  );
};
