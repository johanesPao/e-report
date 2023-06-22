import { Box, Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import {
  MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MantineReactTable,
} from "mantine-react-table";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { unduhTabelKeExcel } from "../fungsi/basic";
import { useAppSelector } from "../state/hook";
import { getHalaman } from "../fitur_state/event";

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
          enableStickyHeader
          memoMode="cells"
          // enableRowActions
          // enableRowSelection
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
          renderTopToolbarCustomActions={() => (
            <Box
              sx={{
                display: "flex",
                gap: "16px",
                padding: "8px",
                flexWrap: "wrap",
              }}
            >
              <Button
                color="green"
                onClick={() => unduhTabelKeExcel(arrData, halaman)}
                leftIcon={<IconDownload />}
                variant="filled"
              >
                Unduh ke Excel
              </Button>
            </Box>
          )}
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
