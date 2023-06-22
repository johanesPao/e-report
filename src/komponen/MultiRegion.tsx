import { MultiSelect } from "@mantine/core";
import { DataMultiSelect } from "../fitur_state/dataParam";
import { StateInputDrawerPenjualan } from "../fungsi/halaman/penjualan";

interface MultiRegionProps {
  arrayRegionLabel: DataMultiSelect[];
  props: StateInputDrawerPenjualan;
  setProps: React.Dispatch<React.SetStateAction<StateInputDrawerPenjualan>>;
}

const MultiRegion = ({
  arrayRegionLabel,
  props,
  setProps,
}: MultiRegionProps) => {
  return (
    <MultiSelect
      data={arrayRegionLabel}
      limit={10}
      searchable
      nothingFound="Tidak ada region ditemukan"
      value={props.nilaiRegion}
      onChange={(nilai) =>
        setProps((stateSebelumnya) => ({
          ...stateSebelumnya,
          nilaiRegion: nilai,
        }))
      }
      placeholder="Pilih Region"
      label="Region"
      clearable
      transitionProps={{
        duration: 150,
        transition: "scale-y",
        timingFunction: "ease-out",
      }}
      dropdownPosition="bottom"
    />
  );
};

export default MultiRegion;
