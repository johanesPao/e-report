import {
  MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MantineReactTable,
} from "mantine-react-table";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

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
      <SimpleBar style={{ height: "100vh" }}>
        <MantineReactTable<T>
          columns={arrKolom}
          data={arrData}
          enableColumnFilterModes
          // enableColumnOrdering
          enableColumnDragging={false}
          enablePinning
          enableGrouping
          enableColumnActions={false}
          enableFilterMatchHighlighting={false}
          enableDensityToggle={false}
          memoMode="cells"
          // enableRowActions
          enableRowSelection
          mantineTableContainerProps={{
            sx: { height: "100%" },
          }}
          initialState={{
            pagination: {
              pageSize: 15,
              pageIndex: 0,
            },
            showColumnFilters: false,
            density: "xs",
          }}
          positionToolbarAlertBanner="bottom"
          renderToolbarInternalActions={({ table }) => {
            return (
              <>
                <MRT_ToggleFiltersButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
              </>
            );
          }}
          state={{ isLoading: memuatData }}
        />
      </SimpleBar>
    </div>
  );
};
